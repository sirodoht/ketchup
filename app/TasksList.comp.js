import React from 'react';

/**
 * TasksList component.
 */
export default class TasksList extends React.Component {
  constructor(props) {
    super(props);
  }

  /**
   * Render component.
   */
  render() {
    const createItem = function(item) {
      return (
        <tr key={item.id} className={item.current ? 'info' : null}>
          <th>{item.id + 1}</th>
          <th className={item.task === 'Break' ? 'taskCell break' : 'task-cell'}>{item.task}</th>
          <th className="text-right">{item.durationMins}:{item.durationSecs}</th>
        </tr>
      );
    };
    return (
      <div className="list">
        <table className="table table-stripped">
          <thead>
            <tr>
              <th></th>
              <th>Task</th>
              <th className="text-right">Duration</th>
            </tr>
          </thead>
          <tbody>
            {this.props.tasksList.map(createItem)}
          </tbody>
        </table>
      </div>
    );
  }
}

/**
 * React prop types typechecking for TasksList.
 */
TasksList.propTypes = {
  tasksList: React.PropTypes.array,
};
