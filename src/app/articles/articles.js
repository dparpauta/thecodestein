class Articles extends React.Component {
  constructor() {
    super();
    // this.getArticles(this.props.url);
    this.state = {
      articleUrls: [
        "static/greetings.md",
        "static/greetings.md"
      ]
    };
  }

  getArticles(url) {
    axios
    .get(url)
    .then(response => {
      this.setState({articleUrls: response.data});
    });
  }

  render() {
    return (
      <div>
      {this.state.articleUrls.map((articleUrl, index) => (
        <Article key={index} url={articleUrl}/>
        ))}
      </div>
    );
  }
}

// Articles.propTypes = {
  // url: React.PropTypes.object.isRequired
// }
