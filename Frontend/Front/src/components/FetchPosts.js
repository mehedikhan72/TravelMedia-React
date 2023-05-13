import React, { useState, useEffect, useContext, useReducer } from "react";
import { Link } from "react-router-dom";
import CreatePost from "./CreatePost";
import Likes from "./interactions/Likes";
import Comments from "./interactions/Comments";
import ShowImages from "./ShowImages";
import InfiniteScroll from "react-infinite-scroll-component";
import CommentCount from "./interactions/CommentCount";
import StarRatings from "react-star-ratings";
import PostOptions from "./PostOptions";
import Loading from "../utils/Loading";

export default function FetchPosts(props) {

  const url = props.url;
  const ownProfile = props.ownProfileViewed;
  const feedView = props.feedView;
  const savedPosts = props.savedPosts;

  const [data, setData] = useState([]);
  const [plsReload, setPlsReload] = useState(false);
  const [postDeleted, setPostDeleted] = useState(false);
  const [postEdited, setPostEdited] = useState(false);

  // INFINITE SCROLL
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const PAGE_LIMIT = 5;
  const [maxPage, setMaxPage] = useState(1);
  // console.log(postEdited);

  useEffect(() => {
    setPlsReload(!plsReload);
    setPage(1);
    setHasMore(true);
    setMaxPage(1);
    setData([]);
  }, [props.query, props.searchView, postDeleted, postEdited, url]);

  useEffect(() => {
    fetchPosts();
  }, [page, plsReload]);

  let fetchUrl = `${url}?page=${page}`;
  if (props.searchView === 'places') {
    fetchUrl = `${url}?page=${page}&query=${props.query}`
  }

  const [fetchCompleted, setFetchCompleted] = useState(false);
  const fetchPosts = () => {
    // FORCE-FIX: This if statement and the useEffect above are working
    // together to handle the bug of using InfinityScroll in two
    // diff pages(feed <-> profile). It's working for now but I need to come up with a better
    // solution later down the line. Otherwise, it will break down somewhere.
    // console.log("fetching_data");
    if (page <= maxPage) {
      // console.log(fetchUrl);
      fetch(fetchUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("access_token")}`
        }
      })
        .then(response => response.json())
        .then(json => {
          console.log(json);
          // when the search param doesn't match any place, automatically showing users(if available) in the search results.
          if (json.count === 0 && props.searchView === 'places') {
            props.noPlacesFound();
          }
          if (props.eachPostDetail !== true) {
            setMaxPage(json.count)
          }

          let newPostData;
          if (savedPosts === true && json.count !== 0) {
            newPostData = [...data].concat(json.results[0].post)
          } else if (props.eachPostDetail === true) {
            newPostData = [...data].concat(json)
          } else if (props.followingPosts === true && json.count !== 0) {
            newPostData = [...data].concat(json)
          } else {
            newPostData = [...data].concat(json.results)
          }
          setData(newPostData);
          if (data.length + PAGE_LIMIT >= json.count) {
            setHasMore(false);
          }
          // console.log("current feed page count:" + page)
          // console.log("Fetch post ran.");
          setFetchCompleted(true);
        })
        .catch((error) => console.log(error));
    }
  }

  const newPostAdded = (newPost) => {
    const newData = [newPost, ...data]
    setData(newData);
  }

  const [postDetailViewOn, setPostDetailViewOn] = useState(false);
  const [detailViewPostID, setDetailViewPostId] = useState(null);

  const enableDetailView = (id) => {
    setPostDetailViewOn(true);
    setDetailViewPostId(id);
    document.body.classList.add('disabled-scroll');
  }

  const disableDetailView = () => {
    setPostDetailViewOn(false);
    setDetailViewPostId(null);
    document.body.classList.remove('disabled-scroll');
  }

  // Logic for post options
  const [postOptionsVisible, setPostOptionsVisible] = useState(false);
  const [visiblePostId, setVisiblePostId] = useState(null);

  const enablePostOptions = (id) => {
    disablePostOptions();
    setPostOptionsVisible(true);
    setVisiblePostId(id);
  }

  const disablePostOptions = () => {
    setPostOptionsVisible(false);
    setVisiblePostId(null);
  }

  const [isSaved, setIsSaved] = useState(null);

  const isPostSaved = (id) => {
    const url = `https://travelmedia-api-production.up.railway.app/api/is_post_saved/${id}/`;
    fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("access_token")}`
      }
    })
      .then(response => response.json())
      .then(data => {
        setIsSaved(data.message);
        console.log(isSaved);
      })
    // console.log("f")
  }

  return (
    <div>
      {(ownProfile || feedView) && <CreatePost
        newPostAdded={newPostAdded}
      />}

      <InfiniteScroll
        dataLength={data.length}
        next={() => setPage(prevState => prevState + 1)}
        hasMore={hasMore}
      >
        <div>
          {data.length === 0 && !fetchCompleted && <Loading />}
          {data.length === 0 && fetchCompleted && <div className="matched-margin center"><hr className="hr" /> <h3>No posts to show.</h3></div>}
          {data.map((item) => (
            <div key={item.id}>
              <div className={postDetailViewOn && detailViewPostID === item.id ? "confirmation" : ""}>
                <div className={postDetailViewOn && detailViewPostID === item.id ? "each-post each-post-detailed-view" : "each-post"} id={item.id}>
                  {postDetailViewOn && detailViewPostID === item.id &&
                    <div className="post-detail-heading">
                      <h4 className="mt-3">Post detail</h4>
                      <button className='my-btns' onClick={disableDetailView} type='submit'>X</button>
                    </div>
                  }
                  {postDetailViewOn && detailViewPostID === item.id && <hr />}
                  <div className="post-heading">
                    <p className="post-title">
                      <strong>
                        <Link className="no-style-links" to={{ pathname: `/profiles/${item.creator.username}` }}>
                          {item.creator.first_name ? item.creator.first_name + " " + item.creator.last_name : item.creator.username}
                        </Link></strong> is at <strong>{item.place}</strong>
                    </p>
                    <button
                      onClick={() => {
                        isPostSaved(item.id);
                        enablePostOptions(item.id)
                      }}
                      className="three-dots"><i className='medium-sized-logo bx bx-dots-horizontal-rounded'></i>
                    </button>
                  </div>

                  {/* Dropdown menu!! */}
                  {postOptionsVisible && item.id === visiblePostId &&
                    <PostOptions
                      post={item}
                      disablePostOptions={disablePostOptions}
                      isSaved={isSaved}
                      postDeleted={postDeleted}
                      setPostDeleted={setPostDeleted}
                      PostEdited={postEdited}
                      setPostEdited={setPostEdited}
                    />}

                  <div className="ratings">
                    <StarRatings starRatedColor="orange" starDimension="15px" starSpacing="0px" rating={item.trip_rating} /><p className="display-inline-block post-date">{item.trip_date}</p>
                  </div>
                  <Link to={`https://www.google.com/maps/search/${item.place}/`} className="no-style-links link-text" target="_blank" rel="noopener noreferrer">Visit in maps</Link>
                  <br />

                  <br />
                  <h6>{item.post}</h6>
                  <br />
                  <ShowImages id={item.id} enableDetailView={enableDetailView} />
                  <br />


                  <div className="two-data">
                    <div>
                      <div className="post-data-title">
                        <i className='bx bx-bed'></i><p className="big-info-text">Stayed for</p>
                      </div>
                      <h4 className="center">{item.trip_duration} days</h4>
                    </div>
                    <div>
                      <div className="post-data-title">
                        <i className='bx bx-building-house'></i><p className="big-info-text">Stayed at</p>
                      </div>
                      <h4 className="center">{item.staying_place}</h4>
                    </div>
                  </div>

                  <div className="two-data">
                    <div>
                      <div className="post-data-title">
                        <i className='bx bx-group'></i><p className="big-info-text">Travelled as</p>
                      </div>
                      <h4 className="center">Group of {item.people_count}</h4>
                    </div>
                    <div>
                      <div className="post-data-title">
                        <i className='bx bx-bus'></i><p className="big-info-text">Transportation</p>
                      </div>
                      <h4 className="center">{item.transportation_data}</h4>
                    </div>
                  </div>

                  <div className="two-data">
                    <div>
                      <div className="post-data-title">
                        <i className='bx bx-money-withdraw'></i><p className="big-info-text">Tour Cost(each)</p>
                      </div>
                      <h4 className="center">{item.cost_per_person} BDT</h4>
                    </div>
                    <div>
                      <div className="post-data-title">
                        <i className='bx bx-home-smile' ></i><p className="big-info-text">Hotel Cost(24 hrs)</p>
                      </div>
                      <h4 className="center">{item.staying_place_cost} BDT</h4>
                    </div>
                  </div>

                  <div className="two-data">
                    <div>
                      <div className="post-data-title">
                        <i className='bx bx-star'></i><p className="big-info-text">Trip Rating</p>
                      </div>
                      <h4 className="center ratings"><StarRatings starRatedColor="orange" starDimension="20px" starSpacing="0px" rating={item.trip_rating} /></h4>
                    </div>
                    <div>
                      <div className="post-data-title">
                        <i className='bx bx-star'></i><p className="big-info-text">Hotel Rating</p>
                      </div>
                      <h4 className="center ratings"><StarRatings starRatedColor="orange" starDimension="20px" starSpacing="0px" rating={item.staying_place_rating} /></h4>
                    </div>

                  </div>
                  {item.important_things_to_take && <h5>Important things to take</h5>}
                  {item.important_things_to_take && <h6>{item.important_things_to_take}</h6>}
                  <br />
                  {item.cautions && <h5>Cautions</h5>}
                  {item.cautions && <h6>{item.cautions}</h6>}
                  <br />

                  <div className="interaction-menu">
                    <Likes post_id={item.id} post={item} />
                    <button onClick={() => enableDetailView(item.id)} className="my-btns"><CommentCount postId={item.id} /></button>
                  </div>
                  {postDetailViewOn && detailViewPostID === item.id &&
                    <div>
                      {/* <br /> */}
                      <Comments post_id={item.id} />
                    </div>
                  }
                </div>
              </div>
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  )
}