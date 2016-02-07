import ReactDOM from 'react-dom'
import React from 'react'
import { find } from 'lodash'

const TasksList = React.createClass({
  render: function() {
    const createItem = function(item) {
      return (
        <tr key={item.id} className={item.current ? 'info' : null}>
          <th>{item.id + 1}</th>
          <th>{item.task}</th>
          <th>{item.durationMins}:{item.durationSecs}</th>
        </tr>
      )
    }
    return (
      <div className="list">
        <table className="table table-stripped">
          <thead>
            <tr>
              <th></th>
              <th>Task</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            {this.props.tasksList.map(createItem)}
          </tbody>
        </table>
      </div>
    )
  },
})

const Timer = React.createClass({
  getInitialState: function() {
    return {
      timeRemainingMins: 25,
      timeRemainingSecs: '00',
      tasksList: [],
      task: '',
      pomosN: 0,
      breaksN: 0,
      pomosMins: 0,
      breaksMins: 0,
    }
  },
  onChange: function(e) {
    this.setState({task: e.target.value})
  },
  handleSubmit: function(e) {
    e.preventDefault()
    if (this.state.task === '') {
      return
    }
    const newItemArray = [
      {
        id: this.state.tasksList.length + 1,
        task: 'Break',
        durationMins: 5,
        durationSecs: '00',
        current: false,
        createdOn: Date.now(),
      },
      {
        id: this.state.tasksList.length,
        task: this.state.task,
        durationMins: 25,
        durationSecs: '00',
        current: false,
        createdOn: Date.now(),
      },
    ]
    if (!find(this.state.tasksList, {current: true})) {
      newItemArray[1].current = true
    }
    const nextItems = newItemArray.concat(this.state.tasksList)
    const nextText = ''
    this.setState({
      tasksList: nextItems,
      task: nextText,
    })
    if (this.state.tasksList.length === 0) {
      this.start()
    }
  },
  next: function() {
    const currentTask = find(this.state.tasksList, {current: true})
    if ((currentTask.id + 1) === this.state.tasksList.length) {
      return
    }
    const nextTask = find(this.state.tasksList, {id: currentTask.id + 1})
    nextTask.current = true
    currentTask.current = false
    const currentIndex = this.state.tasksList.indexOf(currentTask)
    const nextIndex = this.state.tasksList.indexOf(nextTask)
    const newTasksList = this.state.tasksList
    newTasksList[currentIndex].current = false
    newTasksList[nextIndex].current = true
    this.setState({
      tasksList: newTasksList,
      timeRemainingMins: nextTask.durationMins,
      timeRemainingSecs: nextTask.durationSecs,
    })
    this.calcMetrics()
  },
  calcMetrics: function () {
    const newPomosN = this.state.pomosN + 1
    const newPomosMins = this.state.pomosMins + 25
    const newBreaksN = this.state.breaksN + 1
    const newBreaksMins = this.state.newBreaksMins + 5
    this.setState({
      pomosN: newPomosN,
      breaksN: newBreaksN,
      pomosMins: newPomosMins,
      breaksMins: newBreaksMins,
    })
  },
  tick: function() {
    let newTimeRemainingMins
    let newTimeRemainingSecs
    if (this.state.timeRemainingSecs > 0) {
      newTimeRemainingMins = this.state.timeRemainingMins
      newTimeRemainingSecs = this.state.timeRemainingSecs -  1
      if (newTimeRemainingSecs < 10) {
        newTimeRemainingSecs = '0' + newTimeRemainingSecs
      }
    } else {
      newTimeRemainingMins = this.state.timeRemainingMins - 1
      if (this.state.timeRemainingSecs === 0 || this.state.timeRemainingSecs === '00') {
        newTimeRemainingSecs = 59
      } else {
        newTimeRemainingSecs = this.state.timeRemainingSecs -  1
      }
    }
    this.setState({
      timeRemainingMins: newTimeRemainingMins,
      timeRemainingSecs: newTimeRemainingSecs,
    })
    this.calcMetrics()
  },
  start: function() {
    this.interval = setInterval(this.tick, 1000)
  },
  pause: function() {
    clearInterval(this.interval)
  },
  componentDidUpdate: function() {
    window.localStorage.setItem('ketchupTasks', this.state)
  },
  componentDidMount: function() {
    const restoreData = window.localStorage.getItem('ketchupTasks')
    // console.log('restoreData', restoreData)
    if (restoreData) {
      this.setState(restoreData)
    }
  },
  render: function() {
    return (
      <div className="col-md-8 col-md-offset-2">
        <div>
          <div className="time">{this.state.timeRemainingMins}:{this.state.timeRemainingSecs}</div>
          <div className="controls">
            <button type="button" className="btn btn-default btn-lg" onClick={this.start}>
              <span className="glyphicon glyphicon-play" aria-hidden="true"></span> Start
            </button>
            <button type="button" className="btn btn-default btn-lg" onClick={this.next}>
              <span className="glyphicon glyphicon-check" aria-hidden="true"></span> Next
            </button>
            <button type="button" className="btn btn-default btn-lg" onClick={this.pause}>
              <span className="glyphicon glyphicon-pause" aria-hidden="true"></span> Pause
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
                <div className="panel-body">{this.state.pomosN}</div>
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
                <div className="panel-body">{this.state.breaksN}</div>
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
      </div>
    )
  },
})

ReactDOM.render(<Timer />, document.getElementById('app'))
