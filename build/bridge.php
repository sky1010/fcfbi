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
    define('SERVER_PORT', 3306);
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
        case 'get_contacts':
            try{
                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);
                $contacts = select($connection, "SELECT * FROM contacts ORDER BY UID", []);

                echo json_encode(['data' => $contacts]);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                //return bad http request when error is encountered
                http_response_code(400);
            }            
            break;
        case 'get_contracts':
            try{
                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);
                $contracts = select($connection, "SELECT * FROM zcontrats ORDER BY BuildingName", []);

                echo json_encode(['data' => $contracts]);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                //return bad http request when error is encountered
                http_response_code(400);
            }
            break;
        case 'get_floor_plans':
            try{
                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);
                $floor_plans = select($connection, "SELECT * FROM fplans ORDER BY id", []);

                echo json_encode(['data' => $floor_plans]);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                //return bad http request when error is encountered
                http_response_code(400);
            }                          
            break;

        case 'get_buildings_sidebar_dataset':
            try{
                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);

                $temp = [];
                $client = select($connection, "SELECT COUNT(id) AS tot_col, (CASE 
                    WHEN Client IS NULL THEN 'Empty'
                    ELSE Client
                    END) AS col_name
                    FROM buildings GROUP BY Client", []);
                $temp['Client'] = $client;

                $region = select($connection, "SELECT COUNT(id) AS tot_col, (CASE 
                    WHEN Region IS NULL THEN 'Empty'
                    ELSE Region
                    END) AS col_name
                    FROM buildings GROUP BY Region", []);
                $temp['Region'] = $region;

                $building_name = select($connection, "SELECT COUNT(id) AS tot_col, (CASE 
                    WHEN BuildingName IS NULL THEN 'Empty'
                    ELSE BuildingName
                    END) AS col_name
                    FROM buildings GROUP BY BuildingName", []);
                $temp['BuildingName'] = $building_name;

                echo json_encode(['data' => $temp]);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                //return bad http request when error is encountered
                http_response_code(400);
            }
            break;
        case 'get_contacts_sidebar_dataset':
            try{
                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);

                $temp = [];
                $Name = select($connection, "SELECT COUNT(UID) AS tot_col, (CASE 
                    WHEN Name IS NULL THEN 'Empty'
                    ELSE Name
                    END) AS col_name
                    FROM contacts GROUP BY Name", []);
                $temp['Name'] = $Name;

                echo json_encode(['data' => $temp]);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                //return bad http request when error is encountered
                http_response_code(400);
            }
            break;

        case 'get_contracts_sidebar_dataset':
            try{
                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);

                $temp = [];
                  $client = select($connection, "SELECT COUNT(BuildingName) AS tot_col, (CASE 
                    WHEN Client IS NULL THEN 'Empty'
                    ELSE Client
                    END) AS col_name
                    FROM zcontrats GROUP BY Client", []);
                $temp['Client'] = $client;

                $region = select($connection, "SELECT COUNT(BuildingName) AS tot_col, (CASE 
                    WHEN Region IS NULL THEN 'Empty'
                    ELSE Region
                    END) AS col_name
                    FROM zcontrats GROUP BY Region", []);
                $temp['Region'] = $region;

                $building_name = select($connection, "SELECT COUNT(BuildingName) AS tot_col, (CASE 
                    WHEN BuildingName IS NULL THEN 'Empty'
                    ELSE BuildingName
                    END) AS col_name
                    FROM zcontrats GROUP BY BuildingName", []);
                $temp['BuildingName'] = $building_name;

                echo json_encode(['data' => $temp]);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                //return bad http request when error is encountered
                http_response_code(400);
            }
            break;

                case 'get_floor_plans_sidebar_dataset':
            try{
                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);

                $temp = [];
                  $UID = select($connection, "SELECT COUNT(UID) AS tot_col, (CASE 
                    WHEN UID IS NULL THEN 'Empty'
                    ELSE UID
                    END) AS col_name
                    FROM fplans GROUP BY UID", []);
                $temp['UID'] = $UID;

                $description = select($connection, "SELECT COUNT(UID) AS tot_col, (CASE 
                    WHEN description IS NULL THEN 'Empty'
                    ELSE description
                    END) AS col_name
                    FROM fplans GROUP BY description", []);
                $temp['description'] = $description;

                echo json_encode(['data' => $temp]);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                //return bad http request when error is encountered
                http_response_code(400);
            }
            break;                                
        case 'get_filtered_dataset':
            try{
                $filters = json_decode($_REQUEST['filters'], true);
                $column = implode(", ", array_keys($filters));
                $in_clauses = [];
                $or_clauses = [];
                $glue = ""; 
                $where_clauses = "";

                foreach ($filters as $k => $v) {
                    if(in_array("Empty", $v)){
                        $or_clauses[] = sprintf("%s IS NULL", $k);
                        array_splice($v, array_search('Empty', $v), 1);
                    }

                    if(!empty($v)){
                        foreach($v AS $kb => $kv) 
                            $v[$kb] = sprintf("'%s'", $kv);
                        $in_clauses[] = sprintf("%s IN ( %s )", $k, implode(", ", $v));
                    }
                } 

                $glue = empty($in_clauses)?" ":(empty($or_clauses)?"":" OR ");
                $where_clauses = implode(" AND ", $in_clauses).$glue.implode(" OR ", $or_clauses);

                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);
                $building = select($connection, sprintf("SELECT * FROM buildings WHERE %s ", $where_clauses), []);

                echo json_encode(['data' => $building]);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                //return bad http request when error is encountered
                http_response_code(400);
            }
            break;
        case 'get_filtered_dataset_contacts':
            try{
                $filters = json_decode($_REQUEST['filters'], true);
                $column = implode(", ", array_keys($filters));
                $in_clauses = [];
                $or_clauses = [];
                $glue = ""; 
                $where_clauses = "";

                foreach ($filters as $k => $v) {
                    if(in_array("Empty", $v)){
                        $or_clauses[] = sprintf("%s IS NULL", $k);
                        array_splice($v, array_search('Empty', $v), 1);
                    }

                    if(!empty($v)){
                        foreach($v AS $kb => $kv) 
                            $v[$kb] = sprintf("'%s'", $kv);
                        $in_clauses[] = sprintf("%s IN ( %s )", $k, implode(", ", $v));
                    }
                } 

                $glue = empty($in_clauses)?" ":(empty($or_clauses)?"":" OR ");
                $where_clauses = implode(" AND ", $in_clauses).$glue.implode(" OR ", $or_clauses);

                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);
                $contacts = select($connection, sprintf("SELECT * FROM contacts WHERE %s ", $where_clauses), []);

                echo json_encode(['data' => $contacts]);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                //return bad http request when error is encountered
                http_response_code(400);
            }                        
            break;
                case 'get_filtered_dataset_floor_plans':
            try{
                $filters = json_decode($_REQUEST['filters'], true);
                $column = implode(", ", array_keys($filters));
                $in_clauses = [];
                $or_clauses = [];
                $glue = ""; 
                $where_clauses = "";

                foreach ($filters as $k => $v) {
                    if(in_array("Empty", $v)){
                        $or_clauses[] = sprintf("%s IS NULL", $k);
                        array_splice($v, array_search('Empty', $v), 1);
                    }

                    if(!empty($v)){
                        foreach($v AS $kb => $kv) 
                            $v[$kb] = sprintf("'%s'", $kv);
                        $in_clauses[] = sprintf("%s IN ( %s )", $k, implode(", ", $v));
                    }
                } 

                $glue = empty($in_clauses)?" ":(empty($or_clauses)?"":" OR ");
                $where_clauses = implode(" AND ", $in_clauses).$glue.implode(" OR ", $or_clauses);

                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);
                $fplans = select($connection, sprintf("SELECT * FROM fplans WHERE %s ", $where_clauses), []);

                echo json_encode(['data' => $fplans]);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                //return bad http request when error is encountered
                http_response_code(400);
            }                        
            break;
                case 'get_filtered_dataset_contracts':
            try{
                $filters = json_decode($_REQUEST['filters'], true);
                $column = implode(", ", array_keys($filters));
                $in_clauses = [];
                $or_clauses = [];
                $glue = ""; 
                $where_clauses = "";

                foreach ($filters as $k => $v) {
                    if(in_array("Empty", $v)){
                        $or_clauses[] = sprintf("%s IS NULL", $k);
                        array_splice($v, array_search('Empty', $v), 1);
                    }

                    if(!empty($v)){
                        foreach($v AS $kb => $kv) 
                            $v[$kb] = sprintf("'%s'", $kv);
                        $in_clauses[] = sprintf("%s IN ( %s )", $k, implode(", ", $v));
                    }
                } 

                $glue = empty($in_clauses)?" ":(empty($or_clauses)?"":" OR ");
                $where_clauses = implode(" AND ", $in_clauses).$glue.implode(" OR ", $or_clauses);

                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);
                $zcontrats = select($connection, sprintf("SELECT * FROM zcontrats WHERE %s ", $where_clauses), []);

                echo json_encode(['data' => $zcontrats]);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                //return bad http request when error is encountered
                http_response_code(400);
            }                        
            break;                   
        case 'get_column_name':
            try{
                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);
                $col_names = select($connection, "SELECT column_name FROM information_schema.columns WHERE table_name = ?", [$_REQUEST['table']]);

                echo json_encode(['data' => $col_names]);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                //return bad http request when error is encountered
                http_response_code(400);
            }
            break;
        case 'filter_by_column_name':
            try{
                $filters = implode(", ", json_decode($_REQUEST['filters']));

                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);
                $dataset = select($connection, sprintf("SELECT %s FROM %s ", $filters, $_REQUEST['table']), []);

                echo json_encode(['data' => $dataset]);

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