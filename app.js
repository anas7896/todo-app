  var firebaseConfig = {
    apiKey: "AIzaSyAacVPxrEAMNoQ6eE8SU5jq1gXyY3Zd_Mk",
    authDomain: "todo-app-c3f4c.firebaseapp.com",
    databaseURL: "https://todo-app-c3f4c-default-rtdb.firebaseio.com",
    projectId: "todo-app-c3f4c",
    storageBucket: "todo-app-c3f4c.appspot.com",
    messagingSenderId: "504013957598",
    appId: "1:504013957598:web:f017def6a19ec12c33154f"
  };

  // Initialize Firebase
  var app = firebase.initializeApp(firebaseConfig);

  var db = firebase.database();

  window.addEventListener('load', () => {
	var form = document.querySelector("#new-task-form");
	var input = document.querySelector("#new-task-input");
	var list_el = document.querySelector("#tasks");
  
	form.addEventListener('submit', (e) => {
	  e.preventDefault();
  
	  var task = input.value;
  
	  // Save the task to Firebase
	  if (task) {
		var taskRef = db.ref('tasks').push();
		taskRef.set({
		  id: taskRef.key,
		  text: task
		});
	  }
  
	  input.value = '';
	});
  
	// Load existing tasks from Firebase
	db.ref('tasks').on('value', (snapshot) => {
	  list_el.innerHTML = '';  // Clear existing tasks
	  var tasks = snapshot.val();
	  for (var id in tasks) {
		displayTask(id, tasks[id].text);
	  }
	});
  
	function displayTask(id, task) {
	  var task_el = document.createElement('div');
	  task_el.classList.add('task');
  
	  var task_content_el = document.createElement('div');
	  task_content_el.classList.add('content');
  
	  task_el.appendChild(task_content_el);
  
	  var task_input_el = document.createElement('input');
	  task_input_el.classList.add('text');
	  task_input_el.type = 'text';
	  task_input_el.value = task;
	  task_input_el.setAttribute('readonly', 'readonly');
  
	  task_content_el.appendChild(task_input_el);
  
	  var task_actions_el = document.createElement('div');
	  task_actions_el.classList.add('actions');
  
	  var task_edit_el = document.createElement('button');
	  task_edit_el.classList.add('edit');
	  task_edit_el.innerText = 'Edit';
  
	  var task_delete_el = document.createElement('button');
	  task_delete_el.classList.add('delete');
	  task_delete_el.innerText = 'Delete';
  
	  task_actions_el.appendChild(task_edit_el);
	  task_actions_el.appendChild(task_delete_el);
  
	  task_el.appendChild(task_actions_el);
  
	  list_el.appendChild(task_el);
  
	  task_edit_el.addEventListener('click', (e) => {
		if (task_edit_el.innerText.toLowerCase() == "edit") {
		  task_edit_el.innerText = "Save";
		  task_input_el.removeAttribute("readonly");
		  task_input_el.focus();
		} else {
		  task_edit_el.innerText = "Edit";
		  task_input_el.setAttribute("readonly", "readonly");
		  // Update the task in Firebase
		  db.ref('tasks/' + id).update({
			text: task_input_el.value
		  });
		}
	  });
  
	  task_delete_el.addEventListener('click', (e) => {
		// Remove the task from Firebase
		db.ref('tasks/' + id).remove()
		  .catch((error) => {
			console.error("Error removing task: ", error);
		  });
	  });
	}
  });