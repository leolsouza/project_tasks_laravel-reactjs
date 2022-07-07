import { withStyles } from "@material-ui/core/styles";
import {
  Checkbox,
  FormControl,
  FormGroup,
  FormControlLabel,
  Grid,
} from "@material-ui/core";

import { useEffect, useState } from "react";
import api from "../../services/api";

import { green } from "@material-ui/core/colors";
import { FiTrash } from "react-icons/fi";

const GreenCheckbox = withStyles({
  root: {
    color: green[400],
    "&$checked": {
      color: green[600],
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

export default function Task({ list, listId }) {
  const [token] = useState(localStorage.getItem("token"));
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    getTasks();
  }, [list]);

  useEffect(() => {
    if (list === listId) {
      getTasks();
    }
  }, [listId]);

  const getTasks = async (list_id = "") => {
    const getList = list_id === "" ? list : list_id;
    const response = await api.get(`api/taskgroups/${getList}/tasks`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.data) {
      return setTasks(response.data);
    }
    setTasks([]);
  };
  const handleChange = async (event) => {
    event.preventDefault();
    const taskId = parseInt(event.target.value);

    api
      .put(
        `api/tasks/close/${taskId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        getTasks(response.data.list_id);
      });
  };

  const handleDelete = async (task) => {
    api
      .delete(`/api/tasks/${task}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        getTasks(response.data.list_id);
      })
      .catch((err) => {
        alert(err);
      });
  };

  return (
    <>
      {tasks.length > 0
        ? tasks.map((task) => (
            <Grid container key={task.id}>
              <Grid item xs={10}>
                <FormControl component="fieldset">
                  <FormGroup aria-label="position" row>
                    <FormControlLabel
                      value={task.id}
                      control={<GreenCheckbox checked={task.completed === true} onChange={handleChange}/>}
                      label={task.title}
                      labelPlacement="end"
                    />
                  </FormGroup>
                </FormControl>
              </Grid>
              <Grid item xs={2}>
                <FiTrash
                  className="floatRight deleteIcon"
                  onClick={() => handleDelete(task.id)}
                  size={18}
                />
              </Grid>
            </Grid>
          ))
        : null}
    </>
  );
}
