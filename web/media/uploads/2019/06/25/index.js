const { exec } = require('child_process');
const { app, BrowserWindow, Menu } = require('electron')

/****
 * Use `electron-packager .` to build this App
 */

let win

function createWindow () {
  win = new BrowserWindow({
    width: 650,
    height: 800,
    minWidth: 650,
    minHeight: 800,
    title: "cq-app",
    icon: __dirname + "/static/icons/icon.png",
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadFile('templates/index.html')

  win.on('closed', () => {
    win = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})

/* Menu handled in render.js (client side) */
const menu = new Menu()
Menu.setApplicationMenu(menu)

function execute(command, callback)
{
  exec(command, function(error, stdout, stderr){ callback(stdout) })
}

function move_n_execute(path_to_directory, command, callback)
{
  var cmd = `cd ${path_to_directory} & ${command}`;
  exec(cmd, function(error, stdout, stderr){ callback(stdout) })
}

exports.get_machine_state = (name, callback)=>{
  execute("docker-machine ls", (stdout)=>{
    var rows = stdout.replace(/\r/g, "").split("\n");
    name = name.toLowerCase();

    for (var i=0; i<rows.length; i++)
    {
      var row = rows[i];
      var cols = row.split(/[ ]*[ ]/);

      if (name === cols[0].toLowerCase())
      {
        return callback(cols[0], cols[3]);
      }
    }

    return callback(null, null);
  })
}

exports.is_machine_running = (name, callback)=>{
  exports.get_machine_state(name, (name, state)=>{
    try
    {
      return callback(state.toLowerCase() === "running");
    } catch (error) {
      return callback(false);
    }
  })
}

exports.restart_machine = (name, callback)=>{
  execute(`docker-machine restart ${name}`, callback);
}

exports.get_machine_ip = (name, callback)=>{
  execute(`docker-machine ip ${name}`, (stdout)=>{callback(stdout.trim())});
}

exports.start_chrome = (url, callback)=>{
  execute(`start chrome ${url}`, callback);
}

exports.pull_docker_image = (working_directory, docker_image, callback)=>{
  move_n_execute(working_directory, `docker pull ${docker_image}`, callback);
}

exports.push_docker_image = (working_directory, docker_image, callback)=>{
  move_n_execute(working_directory, `docker push ${docker_image}`, callback);
}

exports.run_docker_image = (working_directory, docker_image, callback)=>{
  move_n_execute(working_directory, `docker run -d -p 8000:8000 ${docker_image}:latest`, callback);
}

exports.stop_docker_image = (working_directory, callback)=>{
    move_n_execute(working_directory, `docker stop default_app`, callback);
}

exports.delete_docker_image = (working_directory, docker_image, callback)=>{
    move_n_execute(working_directory, `docker rm default_app`, ()=>
    {
        move_n_execute(working_directory, `docker rmi ${docker_image}:latest`, callback);
    });
}

exports.restart_docker_image = (working_directory, docker_image, callback)=>{
  exports.stop_docker_image(working_directory, ()=>{
    return exports.run_docker_image(working_directory, docker_image, callback);
  })
}

exports.launch_in_chrome = (name, callback)=>{
  exports.get_machine_ip(name, (machine_ip)=>{

    if (machine_ip.search(/^[0-9]*[.][0-9]*[.][0-9]*[.][0-9]*/) == 0)
    {
      exports.start_chrome("http://"+machine_ip+":8000", callback);
    }
    else
    {
        return callback();
    }
  })
}

exports.set_window_progressbar = (value)=>{
  if (win)
  {
    win.setProgressBar(value);
  }
}

exports.test = (callback)=>{
  console.log("YEah")
  callback();
};

// exports.start_chrome("",()=>{})

// Load a remote URL
// win.loadURL('https://github.com')

