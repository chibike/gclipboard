function execute(command, callback)
{
    exec(command, function(error, stdout, stderr){ callback(stdout); });
};

function move_n_execute(path_to_directory, command, callback)
{
    var cmd = `cd ${path_to_directory} & ${command}`;
    console.log(cmd);
    exec(cmd, function(error, stdout, stderr){ callback(stdout); });
};

function get_machine_state(name, callback)
{
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

function restart_machine(name, callback)
{
    execute(`docker-machine restart ${name}`, callback);
}

function get_machine_ip(name, callback)
{
    execute(`docker-machine ip ${name}`, (stdout)=>{callback(stdout+":8000")});
}

function cd_directory(path_to_directory, callback)
{
    execute(`cd ${path_to_directory}`, callback);
}

function ls_directory(callback)
{
    execute("dir", callback);
}

function start_chrome(url, callback)
{
    execute(`start chrome ${url}`, callback);
}

function pull_docker_image(working_directory, docker_image, callback)
{
    move_n_execute(working_directory, `docker pull ${docker_image}`, callback);
}

function push_docker_image(working_directory, docker_image, callback)
{
    move_n_execute(working_directory, `docker push ${docker_image}`, callback);
}

function run_docker_image(working_directory, docker_image, callback)
{
    move_n_execute(working_directory, `docker run -d --name default_app -p 8000:8000 ${docker_image}:latest`, callback);
}

function stop_docker_image(working_directory, callback)
{
    move_n_execute(working_directory, `docker stop default_app`, callback);
}

function delete_docker_image(working_directory, docker_image, callback)
{
    move_n_execute(working_directory, `docker rm default_app`, ()=>
    {
        move_n_execute(working_directory, `docker rmi ${docker_image}:latest`, callback);
    });
}

function launch_in_chrome(name, callback)
{
    get_machine_ip(name, (machine_ip)=>{
        if (machine_ip.search(/^[0-9]*[.][0-9]*[.][0-9]*[.][0-9]*/) == 0)
        {
            start_chrome(machine_ip, callback);
        }
        else
        {
            return callback();
        }
    })
}

function launch()
{
    restart_machine("default", (stdout)=>{
        setTimeout(()=>{
            pull_docker_image("C:/Users/cqdemo/demonstration_ws","dev-gitlab.cryptoquantique.com:5555/crypto-team/demos/demonstration_ws", (stdout)=>{
                run_docker_image("C:/Users/cqdemo/demonstration_ws","dev-gitlab.cryptoquantique.com:5555/crypto-team/demos/demonstration_ws", (stdout)=>{
                    get_machine_ip("default", (stdout)=>{
                        start_chrome(stdout, ()=>{});
                    })
                });
            });
        }, 10000);
    }
    )
}