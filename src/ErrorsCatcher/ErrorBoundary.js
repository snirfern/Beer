import React from "react";
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: "" };
  }

  componentDidCatch(error) {
    this.setState({ error: `${error.name}: ${error.message}` });
  }

  render() {
    const { error } = this.state;
    if (error) {
      return (
        <div>{error && <NetworkError errorType={this.props.errorType} />}</div>
      );
    } else {
      return <>{this.props.children}</>;
    }
  }
}
export default ErrorBoundary;

export function NetworkError({ errorType }) {
  return (
    <div style={{ textAlign: "center" }}>
      <h1>Error</h1>
      <p>Sorry, something went wrong.</p>
      <input
        type={"image"}
        style={{ position: "absolute", bottom: 10, left: 10 }}
        width={200}
        height={200}
        src={
          errorType && errorType === "statistics"
            ? "./chartpageerror.png"
            : "https://static.vecteezy.com/system/resources/previews/005/005/969/original/beer-can-spill-illustration-free-vector.jpg"
        }
        alt="beer image"
      />
    </div>
  );
}
