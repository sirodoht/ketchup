var React = require('react');
var ReactDOM = require('react-dom');

// var Break = React.createClass({
//   render: function() {
//     return (
//       <tr>
//         <th>*</th>
//         <th>Break</th>
//         <th>5:00</th>
//         <th>Break</th>
//         <th><span className="glyphicon glyphicon-trash" aria-hidden="true"></span></th>
//       </tr>
//     );
//   }
// });

var TasksList = React.createClass({
  render: function() {
    var createItem = function(item) {
      return (
        <tr key={item.id} className={item.current ? 'info' : null}>
          <th>{item.id}</th>
          <th>{item.task}</th>
          <th>25:00</th>
          <th>Pomodoro</th>
          <th className="text-right">
            <span className="glyphicon glyphicon-pencil" aria-hidden="true"></span>
            <span className="glyphicon glyphicon-trash" aria-hidden="true"></span>
          </th>
        </tr>
      );
    };
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
    );
  }
});

var Timer = React.createClass({
  getInitialState: function() {
    return {
      timeRemaining: 1500,
      tasksList: [],
      task: ''
    };
  },
  onChange: function(e) {
    this.setState({task: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    if (this.state.task === '') {
      return;
    }
    if (this.state.tasksList[0]) {
      this.state.tasksList[0].current = false;
    }
    var newItem = {
      id: this.state.tasksList.length + 1,
      task: this.state.task,
      current: true,
      createdOn: Date.now()
    };
    var nextItems = Array.concat(newItem, this.state.tasksList);
    var nextText = '';
    this.setState({
      tasksList: nextItems,
      task: nextText
    });
    if (this.state.tasksList.length === 0) {
      this.start();
    }
  },
  tick: function() {
    this.setState({timeRemaining: this.state.timeRemaining - 1});
  },
  start: function() {
    this.interval = setInterval(this.tick, 1000);
  },
  pause: function() {
    clearInterval(this.interval);
  },
  next: function() {
    clearInterval(this.interval);
    this.setState({timeRemaining: 1500});
  },
  componentWillUnmount: function() {
    clearInterval(this.interval);
  },
  render: function() {
    return (
      <div>
        <div>
          <div className="time">{Math.floor(this.state.timeRemaining / 60)}<small>min</small></div>
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
              <button className="btn btn-default" type="button">{'Add #' + (this.state.tasksList.length + 1)}</button>
            </span>
          </div>
        </form>
        <TasksList tasksList={this.state.tasksList} />
      </div>
    );
  }
});

ReactDOM.render(<Timer />, document.getElementById('app'));
