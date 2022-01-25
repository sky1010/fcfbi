<?php
    require __DIR__.'/vendor/autoload.php';
    use Twilio\Rest\Client;
    /************************************
        Author: -
        Handles Client side ajax request
    *************************************/
    require('handler.php');

    // Database connection
    // Client ajax request type
    define('HOST', "localhost");
    define('USER', "root");
    define('PASSWORD', "");
    define('DB_NAME', "utm");
    define('SERVER_PORT', 3307);
    $request = $_REQUEST['request_type'];

    /*
        Each case represents a request ( Client side ),
        which is processed in the server side, all database or
        file handling are handled below.
    */
    switch ($request) {
        /*TODO CASES*/
        case 'generate_otp':
                $sid = 'ACd19d48e98d5f30b8aba32f2574340ee8';
                $token = 'fb917ca9a1bd9aa87afbcdca59f254bb';
                $client = new Client($sid, $token);

                $phone_number = preg_replace("/[\(\s\)]/", "", $_REQUEST['reg_phone']);
                $verification = $client->verify->v2->services("VA3ded0230dd28d23a53c3aac34ad8c80e")
                                       ->verifications->create($phone_number, "sms");

                echo json_encode(['status' => 200, 'message' => 'OK']);
                http_response_code(200);
            break;
        case 'validateVerificationCode':
            $sid = 'ACd19d48e98d5f30b8aba32f2574340ee8';
            $token = 'fb917ca9a1bd9aa87afbcdca59f254bb';
            $client = new Client($sid, $token);

            $phone_number = preg_replace("/[\(\s\)]/", "", $_REQUEST['number']);
            $verification_check = $client->verify->v2->services("VA3ded0230dd28d23a53c3aac34ad8c80e")
                                         ->verificationChecks->create($_GET['vf_code'],
                                            array("to" => $phone_number));
            echo json_encode(['status' => $verification_check->status]);
            break;
        case 'file_upload':
            if(!empty($_FILES)){
                //check if file follows name convention
                $ftype = $_REQUEST['ftype'];
                $name_rules = [];                

                switch($ftype){
                    case 'student':
                        $name_rules = [
                            "student_card_id_" => [
                                "path" => "../uploads/avatar/",
                                "error" => "File name format for the student card is incorrect, student_card_id_xxxxxx",
                                "prefix" => "student_card_id",
                                "file_type" => "avatar"
                            ],
                            "profile_" => [
                                "path" => "../uploads/proof/",
                                "error" => "File name format for the profile is incorrect, profile_xxxxxx",
                                "prefix" => "profile_",
                                "file_type" => "proof"
                            ]
                        ];
                        break;
                    case "lecturer":
                        $name_rules["profile_"] = [
                            "path" => "../uploads/avatar/",
                            "error" => "File name format for the profile is incorrect, profile_xxxxxx",
                            "prefix" => "profile_",
                            "file_type" => "avatar"
                        ];
                        break;
                    case "dissertation":
                        $name_rules = ["dissertation_" => [
                            "path" => "../uploads/dissertation/",
                            "error" => "File format in incorrect",
                            "prefix" => "dissertation_",
                            "file_type" => "dissertation"
                        ]
                    ];
                    default:
                        break;
                }

                $files = [];
                $error = [];
                $name_rules_keys = array_keys($name_rules);
                preg_match_all('/'.implode('|', $name_rules_keys).'/', implode(', ', $_FILES['file']['name']), $matches);
                if(empty($matches[0])){
                    foreach($name_rules_keys AS $key)
                       $error[] = $name_rules[$key]['error'];
                }else if(count($matches[0]) == 1){
                    $not = array_diff(array_keys($name_rules), $matches[0]);
                    foreach($not AS $key)
                       $error[] = $name_rules[$key]['error'];
                }

                $has_uploaded = false;
                if(empty($error)){
                    $count_file = count($_FILES['file']['name']);
                    $x = 0;
                    
                    while($x < $count_file){
                        preg_match('/'.implode('|', array_keys($name_rules)).'/', $_FILES['file']['name'][$x], $matches);

                        $target_dir = $name_rules[$matches[0]]['path'];
                        $target_file = $target_dir . basename($_FILES['file']['name'][$x]);

                        $imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
                        $check = getimagesize($_FILES['file']['tmp_name'][$x]);
                        if($check !== false) {
                            if (move_uploaded_file($_FILES['file']['tmp_name'][$x], $target_file)) {
                                $error[] = "File uploaded successfully";
                                $files[$name_rules[$matches[0]]['file_type']] = $target_file;
                                $has_uploaded = true;
                            }
                        } else {
                            $error[] = "Incorrect file type, upload images only !";
                            $has_uploaded = false;
                        }
                        $x++;
                    }
                }

                echo json_encode(['status' => ($has_uploaded)?200:400, 'message' => $error, 'files' => $files]);

            }

            break;
        case 'get_course':
            try{
                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);
                $result = select($connection, 'SELECT * FROM tbl_course', []);
                echo json_encode(['data' => $result, 'callback' => 'show_course']);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                //return bad http request when error is encountered
                http_response_code(400);
            }
            break;
        case 'get_school':
            try{
                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);
                $result = select($connection, 'SELECT * FROM tbl_school', []);
                echo json_encode(['data' => $result, 'callback' => 'show_school']);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                //return bad http request when error is encountered
                http_response_code(400);
            }
            break;
        case 'get_cohort':
            try{
                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);
                $result = select($connection, 'SELECT * FROM tbl_cohort', []);
                echo json_encode(['data' => $result, 'callback' => 'show_cohort']);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                //return bad http request when error is encountered
                http_response_code(400);
            }
            break;
        case 'insert_student':
            try{
                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);

                $cohort = select($connection, "SELECT cohort_code FROM tbl_cohort WHERE cohort_id = ? ", [$_REQUEST['reg_cohort']]);

                // Insertion of user in tbl_user
                exec_sql(
                    $connection,
                    'INSERT INTO tbl_users (user_name, user_email, user_phone, user_pwd, user_reg_cohort, student_id) VALUES (?, ?, ?, ?, ?, ?)',
                    [$_REQUEST['reg_fname'], $_REQUEST['reg_email'], $_REQUEST['reg_phone'], $_REQUEST['reg_pwd'], $cohort[0]['cohort_code'],$_REQUEST['reg_student_id']]
                );

                // Retrieve all the roles 
                $role = select($connection, "SELECT role_id FROM tbl_roles WHERE role_code = ? ", [$_REQUEST['reg_role']]);

                // Retrieve the current user id
                $user = select($connection, "SELECT user_id FROM tbl_users WHERE user_email = ? ", [$_REQUEST['reg_email']]);

                // Insertion in tbl_user_role
                exec_sql(
                    $connection,
                    'INSERT INTO tbl_users_role (user_id, role_id, status) VALUES (?, ?, ?)',
                    [$user[0]['user_id'], $role[0]['role_id'], 'pending']
                ); 

                $files = json_decode($_REQUEST['reg_files'], true);

                foreach($files AS $k => $v){
                    // Insertion in tbl_storage
                    exec_sql(
                        $connection,
                        'INSERT INTO tbl_storage (user_id, storage_file_type, storage_file_path) VALUES (?, ?, ?)',
                        [$user[0]['user_id'], $k, $v]
                    );
                }

                echo json_encode(['status' => 200, 'message' => 'OK']);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                //return bad http request when error is encountered
                http_response_code(400);
            }

            break;
        case 'insert_lecturer':
             try{
                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);

                // Insertion of user in tbl_user
                exec_sql(
                    $connection,
                    'INSERT INTO tbl_users (user_name, user_email, user_pwd, cohort_id) VALUES (?, ?, ?, ?)',
                    [$_REQUEST['reg_fname'], $_REQUEST['reg_email'], $_REQUEST['reg_pwd'], json_encode([])]
                );

                // Retrieve all the roles 
                $role = select($connection, "SELECT role_id FROM tbl_roles WHERE role_code = ? ", [$_REQUEST['reg_role']]);

                // Retrieve the current user id
                $user = select($connection, "SELECT user_id FROM tbl_users WHERE user_email = ? ", [$_REQUEST['reg_email']]);

                // Insertion in tbl_user_role
                exec_sql(
                    $connection,
                    'INSERT INTO tbl_users_role (user_id, role_id, status) VALUES (?, ?, ?)',
                    [$user[0]['user_id'], $role[0]['role_id'], 'pending']
                ); 

                $files = json_decode($_REQUEST['reg_files'], true);

                foreach($files AS $k => $v){
                    // Insertion in tbl_storage
                    exec_sql(
                        $connection,
                        'INSERT INTO tbl_storage (user_id, storage_file_type, storage_file_path) VALUES (?, ?, ?)',
                        [$user[0]['user_id'], $k, $v]
                    );
                }

                echo json_encode(['status' => 200, 'message' => 'OK']);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                //return bad http request when error is encountered
                http_response_code(400);
            }

            break;
        case 'verify_login':
            try{
                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);
                $result = select($connection, "SELECT u.*, ur.status, r.role_code, s.storage_file_path, r.role_flags
                    FROM tbl_users u 
                    INNER JOIN tbl_users_role ur ON ur.user_id = u.user_id 
                    INNER JOIN tbl_roles r ON r.role_id = ur.role_id 
                    LEFT JOIN (
                        SELECT * FROM tbl_storage WHERE storage_file_type = 'avatar'
                    ) s ON u.user_id = s.user_id
                    WHERE user_name = ?  AND user_pwd = ? 
                    AND r.role_code IN ('student', 'lecturer', 'dcm', 'clerk', 'admin')", 
                    [ $_REQUEST['login_username'], $_REQUEST['login_pwd']]);

                echo json_encode(['status' => 200, 'data' => $result ]);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                //return bad http request when error is encountered
                http_response_code(400);
            }
            break;
        case 'get_users_student':
            try{
                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);
                $result = select($connection, "SELECT u.*, r.role_code, ur.status, u.cohort_id FROM tbl_users u 
                    INNER JOIN tbl_users_role ur ON u.user_id = ur.user_id
                    INNER JOIN tbl_roles r ON r.role_id = ur.role_id
                    WHERE r.role_code = 'student'", 
                    []);

                echo json_encode(['status' => 200, 'data' => $result ]);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                //return bad http request when error is encountered
                http_response_code(400);
            }
            break;
        case 'link_student_cohort':
            try{
                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);
                $cohort = select($connection, "SELECT cohort_id FROM tbl_cohort WHERE cohort_code = ?", [$_REQUEST['cohort']]);

                exec_sql(
                    $connection,
                    'UPDATE tbl_users SET cohort_id = ? WHERE user_id = ?',
                    [$_REQUEST['link_status'] == 'true'?$cohort[0]['cohort_id']:0, $_REQUEST['student']]
                );

                echo json_encode(['status' => 200, 'message' => $_REQUEST['link_status']]);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                //return bad http request when error is encountered 
                http_response_code(400);
            }           
            break;
        case 'send_sms':
            try{
                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);
                $user = select($connection, "SELECT user_phone FROM tbl_users WHERE user_id = ?", [$_REQUEST['uid']]);

                if(!empty($user)){
                    if(!empty($user[0]['user_phone'])){
                        $sid = 'ACd19d48e98d5f30b8aba32f2574340ee8';
                        $token = 'fb917ca9a1bd9aa87afbcdca59f254bb';
                        $client = new Client($sid, $token);

                        $phone_number = preg_replace("/[\(\s\)]/", "", $user[0]['user_phone']);
                        $message = $client->messages->create("+".$phone_number,
                                   ["body" => $_REQUEST['msg'], "from" => '+14159856656']
                        );
                    }
                }

                echo json_encode(['status' => 200, 'message' => 'sent']);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                //return bad http request when error is encountered
                http_response_code(400);
            }   

            break;
        case 'update_role':
            try{
                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);
                $role = select($connection, "SELECT role_id FROM tbl_roles WHERE role_code = ?", [$_REQUEST['role_code']]);

                exec_sql(
                    $connection,
                    'UPDATE tbl_users_role SET status = ? WHERE user_id = ? AND role_id = ?',
                    [$_REQUEST['granted_role'], $_REQUEST['uid'], $role[0]['role_id']]
                );

                echo json_encode(['status' => 200, 'message' => 'OK']);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                //return bad http request when error is encountered
                http_response_code(400);
            }   

            break;
        case 'get_seggregated_documents':
            $root = '../uploads';
            $eligible_scans = ['avatar', 'dissertation', 'proof'];
            $student_id = $_REQUEST['uid'];
            $paths = [];

            $directories = scandir($root);
            foreach($directories AS $k => $v){
                if(in_array($v, $eligible_scans)){
                    $temp_files = array_diff(scandir($root."/".$v), array('.', '..'));
                    
                    foreach($temp_files AS $z){
                        preg_match_all('/'.$student_id.'/', $z, $matches);
                        
                        if(!empty($matches[0]))
                            $paths[] = implode('/', [$v, $z]);
                    }
                }
            }

            if(!empty($paths)){
                foreach($paths AS $path)
                    copy($root.'/'.$path, $root."/zips/".explode('/', $path)[1]);

                $zip = new ZipArchive();
                if ($zip->open($root.'/zips/zipped_'.$student_id.'.zip', ZIPARCHIVE::CREATE)) {
                    foreach($paths AS $path){
                        $file_name = explode('/', $path)[1];
                        $zip->addFile($root."/zips/".$file_name, $file_name);   
                    }

                    $zip->close(); 
                }

                foreach($paths AS $path)
                    unlink($root."/zips/".explode('/', $path)[1]);
            }

            $path = !empty($paths)?$root.'/zips/zipped_'.$student_id.'.zip':null;
            echo json_encode(["status" => 200, "path" => $path]);

            break;
        case 'get_summary_students':
            try{
                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);
                $result = select($connection, "SELECT s.school_name, COUNT(z.user_id) AS number_of_enrollment FROM tbl_school s 
                    LEFT JOIN tbl_cohort c ON c.school_id = s.school_id
                    LEFT JOIN (
                        SELECT u.* FROM tbl_users u INNER JOIN tbl_users_role ur ON u.user_id = ur.user_id INNER JOIN tbl_roles r ON r.role_id = ur.role_id
                        WHERE r.role_code = 'student'
                    ) z ON z.cohort_id = c.cohort_id
                    GROUP BY s.school_name", []);

                echo json_encode(['status' => 200, 'data' => $result]);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                //return bad http request when error is encountered
                http_response_code(400);
            }   

            break;
        case 'get_markers':
            try{
                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);
                $general_info = select($connection, "SELECT u.*, r.role_code, ur.status, u.cohort_id FROM tbl_users u
                    INNER JOIN tbl_users_role ur ON u.user_id = ur.user_id
                    INNER JOIN tbl_roles r ON r.role_id = ur.role_id
                    WHERE r.role_code = 'lecturer'", []);

                echo json_encode(['status' => 200, 'data' => $general_info]);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                //return bad http request when error is encountered
                http_response_code(400);
            }  

            break;
        case 'get_cohort_marker':
            try{
                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);
                $user = select($connection, "SELECT cohort_id FROM tbl_users WHERE user_id = ?", [$_REQUEST['uid']]);
                $cohorts = null;
                $rel_cohorts = null;
                $cid = [];

                $temp_cohort = [];
                if(!empty($user[0]['cohort_id']) && ($user[0]['cohort_id'] != '[]')){
                    $user_cohorts = json_decode($user[0]['cohort_id'], true);
                    $param = str_repeat("?, ", count($user_cohorts));
                    $rel_cohorts = select($connection, "SELECT cohort_id, cohort_code FROM tbl_cohort WHERE cohort_id IN 
                        (".substr($param, 0, strlen($param) - 2).")", [...$user_cohorts]);

                    foreach ($rel_cohorts as $k => $v) 
                        $cid[] = $v['cohort_id'];
                }

                $all_cohorts = select($connection, "SELECT cohort_id, cohort_code FROM tbl_cohort", []); 

                foreach ($all_cohorts as $k => $v) {
                    $temp_cohort[] = [
                        "cohort_id" => $v['cohort_id'],
                        "cohort_code" => $v['cohort_code'], 
                        "rel_status" => in_array($v['cohort_id'], $cid)
                    ];
                }

                echo json_encode(['status' => 200, 'data' => $temp_cohort]);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                //return bad http request when error is encountered
                http_response_code(400);
            }  

            break;
        case 'get_students_marker':
            try{
                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);

                $users_marker = select($connection, "SELECT u.user_id, u.user_name, u.student_id, c.cohort_code, z.user_id AS marker_id, z.role_id AS 
                    marker_role_id, z.role_code AS rel, z.status AS rel_status, z.student_id AS rel_student FROM tbl_users u
                    INNER JOIN tbl_users_role ur ON ur.user_id = u.user_id
                    INNER JOIN tbl_roles r ON ur.role_id = r.role_id
                    INNER JOIN tbl_cohort c ON c.cohort_id = u.cohort_id
                    LEFT JOIN (
                        SELECT iur.user_id, iur.role_id, ir.role_code, iur.student_id, iur.status FROM tbl_users_role iur
                        INNER JOIN tbl_roles ir ON iur.role_id = ir.role_id
                        WHERE ir.role_code = 'marker'
                    ) z ON z.student_id = u.user_id
                    WHERE r.role_code = 'student'
                    AND z.user_id = ? OR z.user_id IS NULL", [$_REQUEST['uid']]);

                $users_second_accessor = select($connection, "SELECT u.user_id, u.user_name, u.student_id, c.cohort_code, z.user_id AS marker_id, z.role_id AS 
                    marker_role_id, z.role_code AS rel, z.status AS rel_status, z.student_id AS rel_student FROM tbl_users u
                    INNER JOIN tbl_users_role ur ON ur.user_id = u.user_id
                    INNER JOIN tbl_roles r ON ur.role_id = r.role_id
                    INNER JOIN tbl_cohort c ON c.cohort_id = u.cohort_id
                    LEFT JOIN (
                        SELECT iur.user_id, iur.role_id, ir.role_code, iur.student_id, iur.status FROM tbl_users_role iur
                        INNER JOIN tbl_roles ir ON iur.role_id = ir.role_id
                        WHERE ir.role_code = 'second_accessor'
                    ) z ON z.student_id = u.user_id
                    WHERE r.role_code = 'student'
                    AND z.user_id = ? OR z.user_id IS NULL", [$_REQUEST['uid']]);

                $users = array_merge($users_marker, $users_second_accessor);

                echo json_encode(['status' => 200, 'data' => $users]);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                //return bad http request when error is encountered
                http_response_code(400);
            }  

            break;
        case 'rel_student_marker':
            try{
                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);
                $rel = select($connection, "SELECT * FROM tbl_users_role WHERE student_id = ? AND user_id = ?", 
                    [$_REQUEST['student_id'], $_REQUEST['marker_id']]);

                $role_id = select($connection, "SELECT role_id FROM tbl_roles WHERE role_code = ?", [$_REQUEST['role']]);

                if(!empty($rel)){
                    exec_sql(
                        $connection,
                        'UPDATE tbl_users_role SET role_id = ? WHERE student_id = ? AND user_id = ?',
                        [$role_id[0]['role_id'], $_REQUEST['student_id'], $_REQUEST['marker_id']]
                    );
                }else{    
                    exec_sql(
                        $connection,
                        'INSERT INTO tbl_users_role (user_id, role_id, status, student_id) VALUES (?, ?, ?, ?)',
                        [$_REQUEST['marker_id'], $role_id[0]['role_id'], 'pending', $_REQUEST['student_id']]
                    );
                }

                echo json_encode(['status' => 200, 'message' => 'OK']);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                //return bad http request when error is encountered
                http_response_code(400);
            }  

            break;       
        case 'rel_student_marker_status':
            try{
                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);
                $rel = select($connection, "SELECT * FROM tbl_users_role WHERE student_id = ? AND user_id = ?", 
                    [$_REQUEST['student_id'], $_REQUEST['marker_id']]);


                if(!empty($rel)){
                    exec_sql(
                        $connection,
                        'UPDATE tbl_users_role SET status = ? WHERE student_id = ? AND user_id = ?',
                        [$_REQUEST['rel_status'], $_REQUEST['student_id'], $_REQUEST['marker_id']]
                    );                   
                }

                echo json_encode(['status' => 200, 'message' => 'OK']);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                //return bad http request when error is encountered
                http_response_code(400);
            }  
            break; 
        case 'rel_student_marker_destroy':
            try{
                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);
                $rel = select($connection, "SELECT * FROM tbl_users_role WHERE student_id = ? AND user_id = ?", 
                    [$_REQUEST['student_id'], $_REQUEST['marker_id']]);


                if(!empty($rel)){
                    exec_sql(
                        $connection,
                        'DELETE FROM tbl_users_role WHERE student_id = ? AND user_id = ?',
                        [$_REQUEST['student_id'], $_REQUEST['marker_id']]
                    );
                }              

                echo json_encode(['status' => 200, 'message' => 'OK']);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                //return bad http request when error is encountered
                http_response_code(400);
            }  
            break;    
        case 'has_rel_student_cohort':
            try{
                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);
                $users = select($connection, "SELECT user_id FROM tbl_users WHERE cohort_id = ? ", 
                    [$_REQUEST["cid"]]);

                $temp = [false];

                foreach($users AS $k => $v){
                    $rel = select($connection, "SELECT * FROM tbl_users_role WHERE user_id = ? AND student_id = ?", 
                    [$_REQUEST["uid"], $v['user_id']]);

                    $temp[] = !empty($rel);
                }

                echo json_encode(['status' => 200, 'data' => $temp]);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                //return bad http request when error is encountered
                http_response_code(400);
            }  
            break;
        case 'has_rel_cohort':
            try{
                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);
                $marker_cohort = select($connection, "SELECT cohort_id FROM tbl_users WHERE user_id = ? ", [$_REQUEST["marker_id"]]);
                $student_cohort = select($connection, "SELECT cohort_id FROM tbl_users WHERE user_id = ? ", [$_REQUEST["student_id"]]);
                $rel_cohorts = false;

                if(!empty($marker_cohort)){
                    $marker_cohort = json_decode($marker_cohort[0]['cohort_id'], true);
                    $rel_cohorts = in_array($student_cohort[0]['cohort_id'], $marker_cohort);
                }

                echo json_encode(['status' => 200, 'data' => $rel_cohorts]);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                //return bad http request when error is encountered
                http_response_code(400);
            }              
            break;
        case 'ope_rel_cohort':
            try{
                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);
                $marker_cohort = select($connection, "SELECT cohort_id FROM tbl_users WHERE user_id = ? ", [$_REQUEST["uid"]]);
                $temp = [];

                if(!empty($marker_cohort)){
                    $marker_cohort = json_decode($marker_cohort[0]['cohort_id'], true);
                    $temp = [...$temp, ...$marker_cohort];
                }
                
                if($_REQUEST['ope'] == 'rel_add'){
                    $temp[] = intval($_REQUEST['cid']);
                } else if($_REQUEST['ope'] == 'rel_rem'){
                    unset($temp[array_search($_REQUEST['cid'], $temp)]);
                }

                $temp = json_encode($temp);

                exec_sql(
                    $connection,
                    'UPDATE tbl_users SET cohort_id = ? WHERE user_id = ?',
                    [$temp, $_REQUEST['uid']]
                ); 

                echo json_encode(['status' => 200, 'data' => $temp]);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                //return bad http request when error is encountered
                http_response_code(400);
            }  
            break;
        case 'get_rel_summary':
            try{
                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);
                $users = select($connection, "SELECT u.user_id, u.user_name, u.student_id, c.cohort_code, z.user_id AS marker_id, z.role_id AS 
                    marker_role_id, z.role_code AS rel, z.status AS rel_status, z.student_id AS rel_student FROM tbl_users u
                    INNER JOIN tbl_users_role ur ON ur.user_id = u.user_id
                    INNER JOIN tbl_roles r ON ur.role_id = r.role_id
                    INNER JOIN tbl_cohort c ON c.cohort_id = u.cohort_id
                    LEFT JOIN (
                        SELECT iur.user_id, iur.role_id, ir.role_code, iur.student_id, iur.status FROM tbl_users_role iur
                        INNER JOIN tbl_roles ir ON iur.role_id = ir.role_id
                        WHERE ir.role_code IN ('marker', 'second_accessor')
                    ) z ON z.student_id = u.user_id
                    WHERE r.role_code = 'student'", []);

                $temp = ["all_student" => count($users), "student" => 0, "marker" => 0, "second_accessor" => 0];

                foreach($users AS $k => $v){
                    $temp[empty($v['rel'])?"student":$v['rel']]++;
                }

                echo json_encode(['status' => 200, 'data' => $temp]);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                //return bad http request when error is encountered
                http_response_code(400);
            }  
 
            break;
        case 'get_cohorts_summary':

            try{
                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);
                $cohort = select($connection, "SELECT c.cohort_code, COALESCE(z.tot_users, 0) AS tot_users
                    FROM tbl_cohort c INNER JOIN tbl_school s ON c.school_id = s.school_id 
                    LEFT JOIN ( 
                        SELECT COUNT(u.user_id) AS tot_users, u.cohort_id FROM tbl_users u 
                        INNER JOIN tbl_users_role ur ON u.user_id = ur.user_id 
                        INNER JOIN tbl_roles r ON r.role_id = ur.role_id WHERE r.role_code = 'student' 
                        GROUP BY u.cohort_id ) z 
                    ON z.cohort_id = c.cohort_id", []);

                echo json_encode(['status' => 200, 'data' => $cohort]);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                //return bad http request when error is encountered
                http_response_code(400);
            }  
 
            break;
        case 'insert_cohort':
            try{
                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);

                $cohort = select($connection, "SELECT * FROM tbl_cohort WHERE cohort_code = ? ", [$_REQUEST['cohort_code']]);

                if(empty($cohort)){
                    exec_sql(
                        $connection,
                        'INSERT INTO tbl_cohort (cohort_code, course_id, school_id) VALUES ( ?, ?, ?)',
                        [$_REQUEST['cohort_code'], $_REQUEST['course_id'], $_REQUEST['school_id']]
                    );   

                    echo json_encode(['status' => 200, 'message' => 'OK']);
                }else{
                    echo json_encode(['status' => 400, 'message' => 'Cohort code already exist']);
                }

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                //return bad http request when error is encountered
                http_response_code(400);
            }  
            break;
        case 'create_user_through_email':
            if(isset($_REQUEST['token'])){
                $encoded_data = json_decode(base64_decode($_REQUEST['token']), true);

                try{
                    //creates a connection, selects the user and send the data as an JSON outstream
                    $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);
                    $rpwd = ucfirst($encoded_data['role']).bin2hex(random_bytes(8))."!";

                    exec_sql(
                      $connection,
                      'INSERT INTO tbl_users (user_name, user_email, user_pwd) VALUES (?, ?, ?)',
                      [$encoded_data['name'], $encoded_data['email'], $rpwd]
                    );

                    $role = select($connection, "SELECT role_id FROM tbl_roles WHERE role_code = ?", [$encoded_data['role']]);
                    $user = select($connection, "SELECT user_id FROM tbl_users WHERE user_pwd = ?", [$rpwd]);

                    exec_sql(
                      $connection,
                      'INSERT INTO tbl_users_role (user_id, role_id, status) VALUES (?, ?, ?)',
                      [$user[0]['user_id'], $role[0]['role_id'], 'approved']
                    );

                    echo json_encode(['status' => 200, 'data' => ['uname' => $encoded_data['name'], 'email' => $encoded_data['email'], 'pwd' => $rpwd]]);

                    //destroy database connection
                    db_disconnect($connection);
                    http_response_code(200);
                }catch(Exception $e){
                    //return bad http request when error is encountered
                    http_response_code(400);
                }           
            }
            break;
        case 'get_user_by_role':
            try{
                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);
                $users = select($connection, "SELECT u.user_id, u.user_name, u.user_email, u.user_date_reg, r.role_code, ur.status FROM tbl_users u 
                    INNER JOIN tbl_users_role ur ON u.user_id = ur.user_id 
                    INNER JOIN tbl_roles r ON r.role_id = ur.role_id
                    WHERE r.role_code = ?", [$_REQUEST['role']]);

                echo json_encode(['status' => 200, 'data' => $users]);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                //return bad http request when error is encountered
                http_response_code(400);
            }  
            break;
        case 'summary_reg':
            try{
                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);

                $users = select($connection, "SELECT count(u.user_id) AS tot_users, r.role_code, ur.status FROM tbl_users u
                    INNER JOIN tbl_users_role ur ON ur.user_id = u.user_id
                    INNER JOIN tbl_roles r ON r.role_id = ur.role_id
                    WHERE r.role_code IN ('student', 'lecturer')
                    AND ur.status IN('approved', 'pending')
                    GROUP BY r.role_code, ur.status", []);

                echo json_encode(['status' => 200, 'data' => $users]);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                //return bad http request when error is encountered
                http_response_code(400);
            }  
            break;
        case 'insert_proposal':
            try{
                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);
               
                exec_sql(
                  $connection,
                  'INSERT INTO tbl_proposals (proposal_code, proposal_title, proposal_description, proposal_status, user_id) VALUES (?, ?, ?, ?, ?)',
                  [$_REQUEST['reg_pf_code'] ,$_REQUEST['reg_title'], $_REQUEST['reg_desc'], 'pending', $_REQUEST['user_id'] ]
                );

                echo json_encode(['status' => 200, 'message' => 'OK']);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                //return bad http request when error is encountered
                http_response_code(400);
            }        
            break;
        case 'get_proposal_form':
            try{
                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);

                if(!empty($_REQUEST['uid'])){
                    $forms = select($connection, "SELECT * FROM tbl_proposals WHERE user_id = ?", [$_REQUEST['uid']]);
                }else{
                    $forms = select($connection, "SELECT p.*, z.student_id FROM tbl_proposals p 
                        INNER JOIN (
                            SELECT u.*, r.role_code FROM tbl_users u
                            INNER JOIN tbl_users_role ur ON u.user_id = ur.user_id
                            INNER JOIN tbl_roles r ON ur.role_id = r.role_id
                            WHERE r.role_code = ?
                        ) z ON z.user_id = p.user_id", [$_REQUEST['role']]);
                }

                echo json_encode(['status' => 200, 'data' => $forms]);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                //return bad http request when error is encountered
                http_response_code(400);
            } 
            break;
        case 'proposal_form_status':
            try{
                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);

                $form_status = select($connection, "SELECT proposal_status FROM tbl_proposals WHERE proposal_id = ?", [$_REQUEST['proposal_fid']]);

                echo json_encode(['status' => 200, 'form_status' => $form_status[0]['proposal_status']]);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                //return bad http request when error is encountered
                http_response_code(400);
            } 
            break;
        case 'proposal_del':
            try{
                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);

                exec_sql( $connection, 'DELETE FROM tbl_proposals WHERE proposal_id = ?', [$_REQUEST['proposal_fid']] );

                echo json_encode(['status' => 200, 'message' => 'OK']);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                //return bad http request when error is encountered
                http_response_code(400);
            } 
            break;
        case 'update_pform_role':
            try{
                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);

                exec_sql( $connection, 'UPDATE tbl_proposals SET proposal_status = ? WHERE proposal_id = ?', [$_REQUEST['access'], $_REQUEST['pfid']] );

                $pf_rel_user = select($connection, "SELECT user_id FROM tbl_proposals WHERE proposal_id = ?", [$_REQUEST['pfid']]);

                $user = select($connection, "SELECT u.*, r.role_code FROM tbl_users u 
                    INNER JOIN tbl_users_role ur ON u.user_id = ur.user_id
                    INNER JOIN tbl_roles r ON ur.role_id = r.role_id WHERE u.user_id = ?", [$pf_rel_user[0]['user_id']]);

                echo json_encode(['status' => 200, 'data' => $user]);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                //return bad http request when error is encountered
                http_response_code(400);
            } 
            break;
        case 'get_pf_code':
            try{
                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);

                $cohort = select($connection, "SELECT cohort_code FROM tbl_cohort WHERE cohort_id = ?", [$_REQUEST['cohort_id']]);
                $cohort_code_stripped = substr($cohort[0]['cohort_code'], 0, -2);

                $pf_cohort = select($connection, "SELECT proposal_code FROM tbl_proposals WHERE proposal_code LIKE ? ", ["%".$cohort_code_stripped."%"]);
                $pf_code = $cohort_code_stripped."-";

                if(!empty($pf_cohort)){
                    $array_code = [];

                    foreach($pf_cohort AS $k => $v){
                        $array_code[] = intval(substr($v['proposal_code'], strpos($v['proposal_code'], '-') + 1));
                    }     

                    $suffix_code = max(...$array_code) + 1;
                    $pf_code .= (($suffix_code < 10?"0":"").$suffix_code);

                }else{
                    $pf_code .= "01";    
                }

                echo json_encode(['status' => 200, 'data' => $pf_code]);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                //return bad http request when error is encountered
                http_response_code(400);
            } 
            break;
        case 'check_pf_exist':
            try{
                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);

                $pf_count = select($connection, "SELECT count(p.proposal_id) AS tot_pf FROM tbl_proposals p 
                        INNER JOIN (
                            SELECT u.*, r.role_code FROM tbl_users u
                            INNER JOIN tbl_users_role ur ON u.user_id = ur.user_id
                            INNER JOIN tbl_roles r ON ur.role_id = r.role_id
                            WHERE r.role_code = 'lecturer'
                        ) z ON z.user_id = p.user_id
                        AND p.proposal_status = 'approved'", []);

                echo json_encode(['status' => 200, 'data' => $pf_count]);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                //return bad http request when error is encountered
                http_response_code(400);
            } 
            break;
        case 'check_pf_exist_cohort':
            try{
                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);

                $cohort_code = select($connection, "SELECT cohort_code FROM tbl_cohort WHERE cohort_id = ? ", [$_REQUEST['cohort_id']]);
                $cohort_code_stripped = substr($cohort_code[0]['cohort_code'], 0, -2);

                $pf_cohort = select($connection, "SELECT count(proposal_id) AS tot_pf FROM tbl_proposals WHERE proposal_code LIKE ? ", ["%".$cohort_code_stripped."%"]);

                echo json_encode(['status' => 200, 'data' => $pf_cohort]);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                //return bad http request when error is encountered
                http_response_code(400);
            } 
            break;
        case 'get_rdw_ds':
            try{
                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);

                $cohort_code = select($connection, "SELECT cohort_code FROM tbl_cohort WHERE cohort_id = ? ", [$_REQUEST['cohort_id']]);
                $cohort_code_stripped = substr($cohort_code[0]['cohort_code'], 0, -2);

                $rdw_ds = select($connection, "SELECT p.proposal_code, p.proposal_title, p.proposal_description, z.user_name, z.user_email FROM tbl_proposals p 
                        INNER JOIN (
                            SELECT u.*, r.role_code FROM tbl_users u
                            INNER JOIN tbl_users_role ur ON u.user_id = ur.user_id
                            INNER JOIN tbl_roles r ON ur.role_id = r.role_id
                            WHERE r.role_code = 'lecturer'
                        ) z ON z.user_id = p.user_id
                        AND p.proposal_status = 'approved' AND p.proposal_code LIKE ? ", ["%".$cohort_code_stripped."%"]);

                foreach($rdw_ds AS $v){
                    $ds = select($connection, "SELECT * FROM tbl_dissertation WHERE dissertation_title = ?", [$v['proposal_title']]);

                    if(empty($ds)){
                        exec_sql( $connection, 'INSERT INTO tbl_dissertation (dissertation_code, dissertation_title, dissertation_desc, dissertation_status) 
                            VALUES (?, ?, ?, ?)', [$v['proposal_code'], $v['proposal_title'], $v['proposal_description'], 'pending'] );
                    }
                }

                $temp = [
                    'header' => $cohort_code[0]['cohort_code']." - Final Year Project Titles",
                    'dataset' => $rdw_ds,
                    'file_name' => $cohort_code_stripped."_PROJECT_LIST_".date('Y-m-d')
                ];

                echo json_encode(['status' => 200, 'data' => $temp]);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                //return bad http request when error is encountered
                http_response_code(400);
            } 
            break;
        case 'insert_dissertation':
            try{
                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);

                $user = select($connection, "SELECT * FROM tbl_users WHERE user_id = ?", [$_REQUEST['uid']]);
                $pf = select($connection, "SELECT * FROM tbl_proposals WHERE proposal_id = ?", [$_REQUEST['pfid']]);

                $ds = select($connection, "SELECT * FROM tbl_dissertation WHERE dissertation_title = ?", [$pf[0]['proposal_title']]);

                if(empty($ds)){
                    exec_sql( $connection, 'INSERT INTO tbl_dissertation (dissertation_code, dissertation_title, dissertation_desc, dissertation_status, 
                        dissertation_student_reg, user_id, dissertation_begin_date) VALUES (?, ?, ?, ?, ?, ?, NOW())', [$pf[0]['proposal_code'], $pf[0]['proposal_title'], $pf[0]['proposal_description'],
                        'inprogress', $user[0]['student_id'], $user[0]['user_id']] );
                }

                echo json_encode(['status' => 200, 'message' => 'OK']);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                //return bad http request when error is encountered
                http_response_code(400);
            }             
            break;
        case 'has_rel_proposal_form':
            try{
                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);

                $pf = select($connection, "SELECT * FROM tbl_proposals WHERE user_id = ?", [$_REQUEST['uid']]);

                echo json_encode(['status' => 200, 'data' => !empty($pf)]);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                //return bad http request when error is encountered
                http_response_code(400);
            }  
            break;
        case 'has_rel_dissertation':
            try{
                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);

                $user = select($connection, "SELECT * FROM tbl_users WHERE user_id = ?", [$_REQUEST['uid']]);
                $dissertation = select($connection, "SELECT * FROM tbl_dissertation WHERE dissertation_student_reg = ?", [$user[0]['student_id']]);

                echo json_encode(['status' => 200, 'data' => !empty($dissertation)]);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                //return bad http request when error is encountered
                http_response_code(400);
            }  
            break;
        case 'has_rel_dissertation_approved':
            try{
                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);

                $dissertation = select($connection, "SELECT * FROM tbl_dissertation WHERE user_id = ?", [$_REQUEST['uid']]);

                echo json_encode(['status' => 200, 'data' => !empty($dissertation)]);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                //return bad http request when error is encountered
                http_response_code(400);
            }  
            break;
        case 'get_dissertation':
            try{
                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);

                $dissertation = select($connection, "SELECT d.dissertation_id, d.dissertation_title, z.user_name, z.user_id AS marker_id FROM tbl_dissertation d 
                    INNER JOIN (
                        SELECT u.*, p.proposal_code FROM tbl_proposals p 
                        INNER JOIN tbl_users u ON p.user_id = u.user_id
                        INNER JOIN tbl_users_role ur ON u.user_id = ur.user_id
                        INNER JOIN tbl_roles r ON r.role_id = ur.role_id
                        WHERE r.role_code = 'lecturer'
                    ) z ON z.proposal_code = d.dissertation_code WHERE d.dissertation_student_reg IS NULL", []);

                echo json_encode(['status' => 200, 'data' => $dissertation]);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                //return bad http request when error is encountered
                http_response_code(400);
            } 
            break;
        case 'link_student_dissertation':
            try{
                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);

                $user = select($connection, "SELECT * FROM tbl_users WHERE user_id = ?", [$_REQUEST['uid']]);
                exec_sql( $connection, 'UPDATE tbl_dissertation SET dissertation_student_reg = ? WHERE dissertation_id = ?', 
                    [$user[0]['student_id'], $_REQUEST['dissertation_id']] );

                echo json_encode(['status' => 200, 'message' => 'OK']);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                //return bad http request when error is encountered
                http_response_code(400);
            } 
            break;
        case 'get_dissertation_rel_pending':
            try{
                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);

                $user = select($connection, "SELECT d.dissertation_id, d.dissertation_code, d.dissertation_title, z.user_name AS marker_name, z.user_id AS marker_id,
                    d.dissertation_student_reg AS student_code, d.dissertation_status 
                    FROM tbl_dissertation d 
                    INNER JOIN (
                        SELECT u.*, p.proposal_code FROM tbl_proposals p 
                        INNER JOIN tbl_users u ON p.user_id = u.user_id
                        INNER JOIN tbl_users_role ur ON u.user_id = ur.user_id
                        INNER JOIN tbl_roles r ON r.role_id = ur.role_id
                        WHERE r.role_code = 'lecturer'
                    ) z ON z.proposal_code = d.dissertation_code AND d.dissertation_student_reg IS NOT NULL AND d.user_id IS NULL", []);

                $temp = [];

                foreach($user AS $k => $v){
                    $student_name = select($connection, "SELECT user_id AS student_id, user_name AS student_name FROM tbl_users WHERE student_id = ?", [$v['student_code']]);
                    $temp[] = array_merge($v, $student_name[0]);
                }
                
                echo json_encode(['status' => 200, 'data' => $temp]);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                //return bad http request when error is encountered
                http_response_code(400);
            } 
            break;
        case 'update_ds_rel_student':
            try{
                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);
                $temp = [];

                if($_REQUEST["ds_status"] == "approved"){

                    $role_id = select($connection, "SELECT role_id FROM tbl_roles WHERE role_code = ?", ['marker']);

                    exec_sql(
                        $connection,
                        'INSERT INTO tbl_users_role (user_id, role_id, status, student_id) VALUES (?, ?, ?, ?)',
                        [$_REQUEST['marker_id'], $role_id[0]['role_id'], 'approved', $_REQUEST['student_id']]
                    );

                    exec_sql(
                        $connection,
                        'UPDATE tbl_dissertation SET user_id = ?, dissertation_status = ?, dissertation_begin_date = NOW() WHERE dissertation_id = ? ',
                        [$_REQUEST['student_id'], 'inprogress', $_REQUEST['ds_id']]
                    );

                    $student = select($connection, "SELECT user_id, user_phone, student_id, user_name AS student_name FROM tbl_users WHERE user_id = ?", [$_REQUEST['student_id']]);
                    $marker = select($connection, "SELECT user_name AS marker_name, user_email FROM tbl_users WHERE user_id = ?", [$_REQUEST['marker_id']]);

                    $temp = array_merge($student[0], $marker[0]);
                    $temp['status'] = 'approved';

                }else if($_REQUEST["ds_status"] == "rejected"){
                    exec_sql(
                        $connection,
                        'UPDATE tbl_dissertation SET dissertation_student_reg = NULL WHERE dissertation_id = ? ', [$_REQUEST['ds_id']]
                    );

                    $student = select($connection, "SELECT user_phone FROM tbl_users WHERE user_id = ?", [$_REQUEST['student_id']]);
                    $temp = $student[0];
                    $temp['status'] = 'rejected';
                }

                echo json_encode(['status' => 200, 'data' => $temp]);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                //return bad http request when error is encountered
                http_response_code(400);
            }             
            break;
        case 'has_rel_lecturer':
            try{
                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);

                $role = select($connection, "SELECT role_id, role_code FROM tbl_roles WHERE role_code = ?", [$_REQUEST['role_type']]);    
                $rel = select($connection, "SELECT * FROM tbl_users_role WHERE student_id = ? AND role_id = ?", 
                    [$_REQUEST['student_id'], $role[0]['role_id']]);

                echo json_encode(['status' => 200, 'data' => ['role_code' => $role[0]['role_code'], 'rel_exist' => !empty($rel)]]);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                //return bad http request when error is encountered
                http_response_code(400);
            }              
            break;
        case 'get_dissertation_student':
            try{
                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);

                $dissertation = select($connection, "SELECT d.* FROM tbl_dissertation d WHERE user_id = ? AND dissertation_status = 'inprogress'", [$_REQUEST['user_id']]);    

                $rel_marker = select($connection, "SELECT u.* FROM tbl_users u 
                    INNER JOIN tbl_users_role ur ON u.user_id = ur.user_id
                    INNER JOIN tbl_roles r ON r.role_id = ur.role_id
                    WHERE r.role_code = 'marker' AND ur.student_id = ?", [$_REQUEST['user_id']]);  

                $rel_sa = select($connection, "SELECT u.* FROM tbl_users u 
                    INNER JOIN tbl_users_role ur ON u.user_id = ur.user_id
                    INNER JOIN tbl_roles r ON r.role_id = ur.role_id
                    WHERE r.role_code = 'second_accessor' AND ur.student_id = ?", [$_REQUEST['user_id']]);    

                $student = select($connection, "SELECT * FROM tbl_users WHERE user_id = ? ", [$_REQUEST['user_id']]);

                $storage_src = select($connection, "SELECT * FROM tbl_storage WHERE user_id = ? AND storage_file_type = ? ", 
                    [$_REQUEST['user_id'], 'dissertation']);

                $storage_report = select($connection, "SELECT * FROM tbl_storage WHERE user_id = ? AND storage_file_type = ? ", 
                    [$_REQUEST['user_id'], 'report']);

                $setup = select($connection, "SELECT * FROM tbl_setup", []);

                $temp = [
                    "student" => $student,
                    "dissertation" => $dissertation,
                    "marker" => $rel_marker,
                    "second_accessor" => $rel_sa,
                    "ds_src_file" => $storage_src,
                    "ds_report" => $storage_report,
                    "setup" => $setup
                ];

                echo json_encode(['status' => 200, 'data' => $temp]);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                //return bad http request when error is encountered
                http_response_code(400);
            }          
            break;
        case 'update_time_left':
            try{
                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);

                exec_sql( $connection, 'UPDATE tbl_dissertation SET dissertation_time_left = ? WHERE dissertation_id = ?', 
                    [$_REQUEST['time_left'], $_REQUEST['ds_id']]);

                echo json_encode(['status' => 200, 'message' => 'OK']);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                //return bad http request when error is encountered
                http_response_code(400);
            } 
            break;
        default:

            // HTTTP CODE BAD REQUEST
            http_response_code(400);
            break;
    }
?>