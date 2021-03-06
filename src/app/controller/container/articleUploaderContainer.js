import {connect} from "react-redux";
import ArticleUploader from "../../view/articleUploader";
import {saveArticles, articlesEditStart, articlesEditStop} from "../modules/articles";

// transforms the state to component properties
const mapStateToProps = state => {
  return {
    isLoggedIn: state.auth.tokenId !== "",
    authToken: state.auth.tokenId,
    hasStarted: state.articles.editStarted,
    fileName: state.articles.fileName,
    contentToEdit: state.articles.contentToEdit
  };
};

// transform the dispatchers to component properties
const mapDispatchToProps = dispatch => {
  return {
    saveArticles: (authToken, content, title) => dispatch(saveArticles(authToken, content, title)),
    articlesEditStart: (content, fileName) => dispatch(articlesEditStart(content, fileName)),
    articlesEditStop: () => dispatch(articlesEditStop())
  };
};

const ArticleUploaderContainer = connect(mapStateToProps, mapDispatchToProps)(ArticleUploader);

export default ArticleUploaderContainer;
