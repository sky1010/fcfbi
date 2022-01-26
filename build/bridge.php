<?php

    /***********************************************************
     *  FCFBI application V1.0
     *  Copyright 2022 
     *  Authors: -
    ***********************************************************/
    require('handler.php');

    // Database connection
    // Client ajax request type
    define('HOST', "localhost");
    define('USER', "root");
    define('PASSWORD', "");
    define('DB_NAME', "fcfbi");
    define('SERVER_PORT', 3307);
    $request = $_REQUEST['request_type'];

    /*
        Each case represents a request ( Client side ),
        which is processed in the server side, all database or
        file handling are handled below.
    */
    switch ($request) {
        case 'get_building_points':
            try{
                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);
                $building = select($connection, "SELECT b.UID, b.BuildingName, b.Longitude, b.Latitude FROM buildings b
                    WHERE b.Longitude <> 'NULL' AND b.Latitude <> 'NULL'", []);

                echo json_encode(['data' => $building]);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                //return bad http request when error is encountered
                http_response_code(400);
            }
            break;
        case 'get_buildings':
            try{
                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);
                $building = select($connection, "SELECT * FROM buildings ORDER BY UID", []);

                echo json_encode(['data' => $building]);

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