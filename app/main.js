import ReactDOM from 'react-dom'
import React from 'react'

// const Break = React.createClass({
//   render: function() {
//     return (
//       <tr>
//         <th>*</th>
//         <th>Break</th>
//         <th>5:00</th>
//         <th>Break</th>
//         <th><span className="glyphicon glyphicon-trash" aria-hidden="true"></span></th>
//       </tr>
//     )
//   }
// })

const TasksList = React.createClass({
  render: function() {
    const createItem = function(item) {
      return (
        <tr key={item.id} className={item.current ? 'info' : null}>
          <th>{item.id}</th>
          <th>{item.task}</th>
          <th>1:00</th>
          <th>Pomodoro</th>
          <th className="text-right">
            <span className="glyphicon glyphicon-pencil" aria-hidden="true"></span>
            <span className="glyphicon glyphicon-trash" aria-hidden="true"></span>
          </th>
        </tr>
      )
    }
    return (
      <div className="list">
        <table className="table table-stripped">
          <thead>
            <tr>
              <th>#</th>
              <th>Task</th>
              <th>Duration</th>
              <th>Type</th>
              <th></th>
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
      timeRemaining: {
        mins: 25,
        secs: '00',
      },
      tasksList: [],
      task: '',
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
    if (this.state.tasksList[0]) {
      this.state.tasksList[0].current = false
    }
    const newItemArray = [{
      id: this.state.tasksList.length + 1,
      task: this.state.task,
      current: true,
      createdOn: Date.now(),
    }]
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
  tick: function() {
    const newTimeRemaining = {}
    if (this.state.timeRemaining.secs > 0) {
      newTimeRemaining.mins = this.state.timeRemaining.mins
      newTimeRemaining.secs = this.state.timeRemaining.secs -  1
      if (newTimeRemaining.secs < 10) {
        newTimeRemaining.secs = '0' + newTimeRemaining.secs
      }
    } else {
      newTimeRemaining.mins = this.state.timeRemaining.mins - 1
      if (this.state.timeRemaining.secs === 0 || this.state.timeRemaining.secs === '00') {
        newTimeRemaining.secs = 59
      } else {
        newTimeRemaining.secs = this.state.timeRemaining.secs -  1
      }
    }
    this.setState({timeRemaining: newTimeRemaining})
  },
  start: function() {
    this.interval = setInterval(this.tick, 1000)
  },
  pause: function() {
    clearInterval(this.interval)
  },
  next: function() {
    clearInterval(this.interval)
    this.setState({timeRemaining: 1500})
  },
  componentWillUnmount: function() {
    clearInterval(this.interval)
  },
  render: function() {
    return (
      <div>
        <div>
          <div className="time">{this.state.timeRemaining.mins}:{this.state.timeRemaining.secs}</div>
          <div className="controls">
            <button type="button" className="btn btn-default btn-lg" onClick={this.start}>Start</button>
            <button type="button" className="btn btn-default btn-lg" onClick={this.pause}>Pause</button>
            <button type="button" className="btn btn-default btn-lg" onClick={this.next}>Next</button>
          </div>
        </div>
        <div className="summary">
          <div className="row">
            <div className="col-sm-3">
              <div className="panel panel-info">
                <div className="panel-heading">
                  <h3 className="panel-title">Pomodoros</h3>
                </div>
                <div className="panel-body">
                  2
                </div>
              </div>
            </div>
            <div className="col-sm-3">
              <div className="panel panel-info">
                <div className="panel-heading">
                  <h3 className="panel-title">Work time</h3>
                </div>
                <div className="panel-body">
                  50:00
                </div>
              </div>
            </div>
            <div className="col-sm-3">
              <div className="panel panel-info">
                <div className="panel-heading">
                  <h3 className="panel-title">Break time</h3>
                </div>
                <div className="panel-body">
                  10:00
                </div>
              </div>
            </div>
            <div className="col-sm-3">
              <div className="panel panel-info">
                <div className="panel-heading">
                  <h3 className="panel-title">Breaks</h3>
                </div>
                <div className="panel-body">
                  1
                </div>
              </div>
            </div>
          </div>
        </div>
        <form onSubmit={this.handleSubmit}>
          <div className="input-group">
            <input type="text" className="form-control" placeholder="Add new task" onChange={this.onChange} value={this.state.task} />
            <span className="input-group-btn">
              <button className="btn btn-default" type="submit">{'Add #' + (this.state.tasksList.length + 1)}</button>
            </span>
          </div>
        </form>
        <TasksList tasksList={this.state.tasksList} />
      </div>
    )
  },
})

ReactDOM.render(<Timer />, document.getElementById('app'))
