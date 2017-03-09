import React from 'react';
import { find, filter } from 'lodash';

import TasksList from './TasksList.comp';

import './Timer.css';

export default class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timeRemainingMins: 25,
      timeRemainingSecs: '00',
      tasksList: [],
      task: '',
      pomosNum: 0,
      breaksNum: 0,
      pomosMins: 0,
      breaksMins: 0,
    };
  }

  onChange(event) {
    this.setState({task: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();

    if (this.state.task === '') {
      return;
    }

    var breaks = filter(this.state.tasksList, {'task': 'Break'});
    const runningBreaksNum = breaks.length + 1;
    let breakDurationMins = 5;
    if (runningBreaksNum >=4 && runningBreaksNum % 4 === 0) {
      breakDurationMins = 15;
    }
    const newItemArray = [
      {
        id: this.state.tasksList.length + 1,
        task: 'Break',
        durationMins: breakDurationMins,
        durationSecs: '00',
        current: false,
        done: false,
        createdOn: Date.now(),
      },
      {
        id: this.state.tasksList.length,
        task: this.state.task,
        durationMins: 25,
        durationSecs: '00',
        current: false,
        done: false,
        createdOn: Date.now(),
      },
    ];
    if (!find(this.state.tasksList, {current: true})) {
      newItemArray[1].current = true;
    }
    const nextItems = newItemArray.concat(this.state.tasksList);
    const nextText = '';
    this.setState({
      tasksList: nextItems,
      task: nextText,
    });
    if (this.state.tasksList.length === 0) {
      this.start();
    }
  }

  next() {
    const currentTask = find(this.state.tasksList, {current: true});
    if ((currentTask.id + 1) === this.state.tasksList.length) {
      return;
    }
    const nextTask = find(this.state.tasksList, {id: currentTask.id + 1});
    currentTask.current = false;
    nextTask.current = true;
    currentTask.done = true;
    nextTask.done = true;
    const currentIndex = this.state.tasksList.indexOf(currentTask);
    const nextIndex = this.state.tasksList.indexOf(nextTask);
    const newTasksList = this.state.tasksList;
    newTasksList[currentIndex].current = false;
    newTasksList[nextIndex].current = true;
    this.setState({
      tasksList: newTasksList,
      timeRemainingMins: nextTask.durationMins,
      timeRemainingSecs: nextTask.durationSecs,
    });
    this.updateMetricsNum();
    this.pause();
    this.start();
  }

  updateMetricsNum() {
    const newTask = find(this.state.tasksList, {current: true});
    let newPomosNum = this.state.pomosNum;
    let newBreaksNum = this.state.breaksNum;
    if (newTask.task === 'Break') {
      newPomosNum = this.state.pomosNum + 1;
    } else {
      newBreaksNum = this.state.breaksNum + 1;
    }
    this.setState({
      pomosNum: newPomosNum,
      breaksNum: newBreaksNum,
    });
  }

  tickMinPomo() {
    const newPomosMins = this.state.pomosMins + 1;
    this.setState({
      pomosMins: newPomosMins,
    });
  }

  tickMinBreak() {
    const newBreakMins = this.state.breaksMins + 1;
    this.setState({
      breaksMins: newBreakMins,
    });
  }

  tick() {
    let newTimeRemainingMins;
    let newTimeRemainingSecs;
    if (this.state.timeRemainingSecs > 0) {
      newTimeRemainingMins = this.state.timeRemainingMins;
      newTimeRemainingSecs = this.state.timeRemainingSecs -  1;
      if (newTimeRemainingSecs < 10) {
        newTimeRemainingSecs = '0' + newTimeRemainingSecs;
      }
    } else {
      newTimeRemainingMins = this.state.timeRemainingMins - 1;
      if (this.state.timeRemainingSecs === 0 || this.state.timeRemainingSecs === '00') {
        newTimeRemainingSecs = 59;
      } else {
        newTimeRemainingSecs = this.state.timeRemainingSecs -  1;
      }
    }
    this.setState({
      timeRemainingMins: newTimeRemainingMins,
      timeRemainingSecs: newTimeRemainingSecs,
    });
    this.listenForNorify();
  }

  start() {
    clearInterval(this.intervalSec);
    this.intervalSec = setInterval(this.tick, 1000);
    const currentTask = find(this.state.tasksList, {current: true});
    if (!currentTask || currentTask.task !== 'Break') {
      this.intervalMin = setInterval(this.tickMinPomo, 1000 * 60);
    } else {
      this.intervalMin = setInterval(this.tickMinBreak, 1000 * 60);
    }
  }

  pause() {
    clearInterval(this.intervalSec);
    clearInterval(this.intervalMin);
  }

  resetTasks() {
    this.setState(this.getInitialState());
    window.localStorage.setItem('ketchupState', '');
  }

  listenForNorify() {
    if (this.state.timeRemainingMins === 0 && this.state.timeRemainingSecs === '00') {
      var audio = new Audio('assets/ding.ogg');
      audio.play();
    }
  }

  componentDidUpdate() {
    window.localStorage.setItem('ketchupState', JSON.stringify(this.state));
  }

  componentDidMount() {
    const restoreStateString = window.localStorage.getItem('ketchupState');
    if (restoreStateString) {
      const restoreState = JSON.parse(restoreStateString);
      this.setState(restoreState);
    }
  }

  render() {
    return (
      <div className="col-md-8 col-md-offset-2">
        <div>
          <div className="time">{this.state.timeRemainingMins}:{this.state.timeRemainingSecs}</div>
          <div className="controls">
            <button type="button" className="btn btn-default btn-sm" onClick={this.pause}>
              Start / Pause
            </button>
            <button type="button" className="btn btn-default btn-lg" onClick={this.next}>
              Next
            </button>
          </div>
        </div>
        <div className="summary">
          <div className="row">
            <div className="col-sm-3">
              <div className="panel panel-info">
                <div className="panel-heading">
                  <h3 className="panel-title">Pomodoros</h3>
                </div>
                <div className="panel-body">{this.state.pomosNum}</div>
              </div>
            </div>
            <div className="col-sm-3">
              <div className="panel panel-info">
                <div className="panel-heading">
                  <h3 className="panel-title">Work time</h3>
                </div>
                <div className="panel-body">{this.state.pomosMins}</div>
              </div>
            </div>
            <div className="col-sm-3">
              <div className="panel panel-info">
                <div className="panel-heading">
                  <h3 className="panel-title">Break time</h3>
                </div>
                <div className="panel-body">{this.state.breaksMins}</div>
              </div>
            </div>
            <div className="col-sm-3">
              <div className="panel panel-info">
                <div className="panel-heading">
                  <h3 className="panel-title">Breaks</h3>
                </div>
                <div className="panel-body">{this.state.breaksNum}</div>
              </div>
            </div>
          </div>
        </div>
        <form onSubmit={this.handleSubmit}>
          <div className="input-group">
            <input type="text" className="form-control" placeholder="Add new task" onChange={this.onChange} value={this.state.task} />
            <span className="input-group-btn">
              <button className="btn btn-default" type="submit">Add</button>
            </span>
          </div>
        </form>
        <TasksList tasksList={this.state.tasksList} />
        <div className="text-center">
          <p className="text-muted">
            <a href="#" onClick={this.resetTasks}>Reset tasks</a>
          </p>
        </div>
      </div>
    );
  }
}
