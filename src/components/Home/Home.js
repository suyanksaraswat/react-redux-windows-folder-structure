import React, { Component } from "react";
import { connect } from "react-redux";
import { simpleAction } from "../../actions/simpleAction";
import {
  IoArrowBackCircleSharp,
  IoArrowForwardCircleSharp,
} from "react-icons/io5";
import { FcFolder } from "react-icons/fc";
import { MdDelete } from "react-icons/md";

/*
 * mapDispatchToProps
 */
const mapDispatchToProps = (dispatch) => ({
  simpleAction: (data) => dispatch(simpleAction(data)),
});

/*
 * mapStateToProps
 */
const mapStateToProps = (state) => ({
  ...state,
});

/**
 * @class App
 * @extends {Component}
 */
class Home extends Component {
  /**
   * @memberof App
   * @summary handles button click
   */
  constructor(props) {
    super(props);
    this.state = {
      newFolderName: "",
      data: this.props.simpleReducer.foldersObj || [],
      currentPageData: [],
    };
  }

  componentDidMount() {
    this.getCurrentPageFolders();
  }

  getCurrentPageFolders = () => {
    this.props.simpleReducer &&
      this.props.simpleReducer.foldersObj.map((res) => {
        if (res.path === this.props.simpleReducer.currentPath) {
          this.setState({ currentPageData: res.folders });
        }
      });
  };

  simpleAction = (data) => {
    this.props.simpleAction && this.props.simpleAction(data);
  };

  createNewFolder = () => {
    if (!this.state.newFolderName || this.state.newFolderName === "") return;
  
    let folderNamExist = false;
    const newData = [...this.state.data];
    newData.map((res) => {
      if (res.path === this.props.simpleReducer.currentPath) {
        res.folders.map(res1 => {
          if (res1 === this.state.newFolderName) {
            folderNamExist = true;
            alert('Folder already with this name, try some other name!');
            return;
          }
        });
      }
    });
  
    if (folderNamExist) return;
  
    newData.map((res) => {
      if (res.path === this.props.simpleReducer.currentPath) {
        res.folders.push(this.state.newFolderName);
      }
      return res;
    });
    newData.push({
      path:
        this.props.simpleReducer.currentPath === "/"
          ? `/${this.state.newFolderName}`
          : `${this.props.simpleReducer.currentPath}/${this.state.newFolderName}`,
      folders: [],
    });
    this.simpleAction({
      history: this.props.simpleReducer.history,
      currentPath: this.props.simpleReducer.currentPath,
      foldersObj: newData,
    });

    this.setState({
      data: newData,
      newFolderName: "",
    });
  };

  onFolderClick = async (res) => {
    let currentPath = this.props.simpleReducer.currentPath === "/"
                        ? `/${res}`
                        : `${this.props.simpleReducer.currentPath}/${res}`;

    await this.simpleAction({
      history: [...this.props.simpleReducer.history, currentPath],
      currentPath: currentPath,
      foldersObj: this.props.simpleReducer.foldersObj,
    });

    this.getCurrentPageFolders();
  };

  goBack = async () => {
    await this.simpleAction({
      history: this.props.simpleReducer.history,
      currentPath:
        this.props.simpleReducer.currentPath.substring(
          0,
          this.props.simpleReducer.currentPath.lastIndexOf("/")
        ) || "/",
      foldersObj: this.props.simpleReducer.foldersObj,
    });

    this.getCurrentPageFolders();
  };

  goNext = async () => {
    let currentPath = undefined;

    for (let i = 0; i < this.props.simpleReducer.history.length-1; i++) {
      if (this.props.simpleReducer.history[i] === this.props.simpleReducer.currentPath) {
        currentPath = this.props.simpleReducer.history[i+1];
        break;
      }
    }

    if (currentPath) {
      await this.simpleAction({
        history: this.props.simpleReducer.history,
        currentPath: currentPath,
        foldersObj: this.props.simpleReducer.foldersObj,
      });
  
      this.getCurrentPageFolders();
    }
  };

  deleteFolder = async (folderName) => {
    let newData = [];
    let folderPath = this.props.simpleReducer.currentPath === "/"
                        ? `/${folderName}`
                        : `${this.props.simpleReducer.currentPath}/${folderName}`;
    this.state.data.map((res) => {
      if (res.path !== folderPath) {
        if (res.path === this.props.simpleReducer.currentPath) {
          const index = res.folders.indexOf(folderName);
          if (index > -1) {
            res.folders.splice(index, 1);
          }
        }
        newData.push(res);
      }
    });
  
    await this.simpleAction({
      history: this.props.simpleReducer.history,
      currentPath: this.props.simpleReducer.currentPath,
      foldersObj: newData,
    });
    this.getCurrentPageFolders();
  }

  render() {
    return (
      <div>
        <div>
          <div className="header">
            <div>
              <IoArrowBackCircleSharp
                className="header-icon"
                onClick={this.goBack}
              />
              <IoArrowForwardCircleSharp className="header-icon" onClick={this.goNext} />
            </div >
            <input disabled value={this.props.simpleReducer.currentPath} style={{width: '600px'}} />
            <div>
              <input
                value={this.state.newFolderName}
                onChange={(e) =>
                  this.setState({ newFolderName: e.target.value })
                }
                placeholder="Enter folder name"
              />
              <button onClick={this.createNewFolder}>New Folder</button>
            </div>
          </div>
          <div class="grid-container">
            {this.state.currentPageData.map((res, index) => (
              <div class="grid-item">
                <span style={{ cursor: "pointer" }} onClick={() => this.onFolderClick(res)}>
                  <div className="grid-item-img">
                    <FcFolder />
                  </div>
                  <div>{res}</div>
                </span>
                <div>
                  <MdDelete style={{cursor: 'pointer'}} onClick={() => this.deleteFolder(res)} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
