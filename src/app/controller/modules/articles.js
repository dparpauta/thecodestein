import axios from "axios";
import marked from "marked";
import CONFIG from "../../configuration/appConfiguration.js";

// Actions
const RECEIVE_ARTICLES = 'app/articles/RECEIVE_ARTICLES';

// const LOAD = 'app/members/LOAD';
// const LOAD_SUCCESS = 'app/members/LOAD_SUCCESS';
// const LOAD_FAIL = 'app/members/LOAD_FAIL';
const EDIT_START = 'app/members/EDIT_START';
const EDIT_STOP = 'app/members/EDIT_STOP';
// const ARTICLES_SAVE = 'app/articles/SAVE';
// const ARTICLES_SAVE_SUCCESS = 'app/articles/SAVE_SUCCESS';
// const SAVE_FAIL = 'app/members/SAVE_FAIL';
// const DELETE = 'app/members/DELETE';
// const DELETE_SUCCESS = 'app/members/DELETE_SUCCESS';
// const DELETE_FAIL = 'app/members/DELETE_FAIL';

// Reducers
const articlesReducer = (state = {list: [], editStarted: false}, action) => {
  switch (action.type) {

    case RECEIVE_ARTICLES:
      return {...state, list: action.articles};

    case EDIT_START:
      return {...state, editStarted: action.value, contentToEdit: action.content, fileName: action.fileName};

    case EDIT_STOP:
      return {...state, editStarted: action.value, contentToEdit: undefined};

    default:
      return state;
  }
};

// Action Creators
export function receiveArticles(articles) {
  return {
    type: RECEIVE_ARTICLES,
    articles
  };
}

export const articlesEditStartSupport = (content, fileName) => {
  // detects if it needs to prettify the content
  let fileContent = content;
  if (fileName.toLowerCase().endsWith(".json")) {
    fileContent = JSON.stringify(content, null, 2);
  }

  // modify the DOM
  return {
    type: EDIT_START,
    value: true,
    content: fileContent,
    fileName
  };
};

export function articlesEditStop() {
  return {
    type: EDIT_STOP,
    value: false
  };
}

export const articlesEditStart = (content, fileName, isRef) => dispatch => {
  if (!isRef) {
    return dispatch(articlesEditStartSupport(content, fileName));
  }

  // when the content to edit comes from an Ref, the last url part will define the fileName
  const finalFileName = content.substring(content.lastIndexOf("/") + 1);
  axios
    .get(content)
    .then(response => dispatch(articlesEditStartSupport(response.data, finalFileName)));
};

export const fetchArticles = () => dispatch => {
  const articleListUrl = CONFIG.api.articles.listPrefix + CONFIG.api.articles.listFileName;
  axios
    .get(articleListUrl)
    .then(response => {
      // for every entry of the array that has been returned,
      // it assumes it is an URL and prepares the requests to get the data
      const articleRequestList = response.data.map(url => axios.get(url));

      axios.all(articleRequestList)
        .then(axios.spread((...articleResponseList) => {
          // map response to expected object
          const articleContentList = articleResponseList.map(response => {
            return {
              url: response.config.url,
              content: marked(response.data)
            };
          });

          // dispatch the update of the articles
          dispatch(receiveArticles(articleContentList));
        }));
    });
};

export const saveArticles = (authToken, content, title) => dispatch => {
  const data = {
    token: `${authToken}`,
    bucket: CONFIG.api.articles.add.bucket,
    key: `${CONFIG.api.articles.add.prefix}${title}`,
    body: `${content}`
  };

  axios
    .post(CONFIG.api.articles.add.url, data)
    .then(() => dispatch(articlesEditStop()))
    .then(() => dispatch(fetchArticles()));
};

export default articlesReducer;
