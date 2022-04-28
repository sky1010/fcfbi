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
    define('USER', "dev3");
    define('PASSWORD', "Forum2022*");
    define('DB_NAME', "fcfbi01db");
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
                $building = select($connection, "SELECT b.UID, b.BuildingName, b.VixenReactive, b.VixenPPM FROM TabsBuildings b
                    WHERE b.VixenReactive <> 'NULL' AND b.VixenPPM <> 'NULL'", []);

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
                $building = select($connection, "SELECT * FROM TabsBuildings ORDER BY UID", []);

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
                $contacts = select($connection, "SELECT * FROM TabsBuildingContacts ORDER BY UID", []);

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
                $contracts = select($connection, "SELECT * FROM COContracts ORDER BY UID", []);

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
            
        case 'get_asset_list':
            try{
                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);
                $assets = select($connection, "SELECT AssetCode, LocationCode, Description, Manufacturer, Model, Created, Finish, ast.Condition, Comments, SerialNumber, CreatedBy, InUse, AssetTrackingCost, DateOfPurchase, PurchaseValue, MonthlyDepreciation, Supplier, LifeExpectancyMonths, ReplacementCost, PurchaseOrderNumber, InvoiceDate, Quantity, OldAssetCode, CapitalItemCode, OwnershipType, Contractor, GeneralLocationDetails, WarrantyExpiryDate, DisposedOf, DisposalDate, PathToPictureFile, DisposedByUser, UID, OwnedByClient, Reference, InsuredBy, CostCode, AdditionalGroup, PuwerAssessmentRequired, PicMode, OwnerName, AsbestosPresent, Label, User1, User2, User3, User4, User5, User6, User7, User8, User9, User10, User11, User12, User13, User14, User15, User16, User17, User18, StatusLevelID, SpecialistModule, CriticalAsset, UserID, CostPerCopy, CallOutCharge, AnnualMaintenanceCost, DataEnabled, AirtimeProvider, DeliveryDate, BillingReference, LeaseStartDate, LeaseEndDate, LeaseDuration, LeaseValue, LeaseTerminationDate, LeaseCostPerQuarter, LeaseWithSupplierID, LeaseWithContractorID, PaymentSchedule, LeaseDetails, ParentAssetID, RemoveFromPATTest, LastPatTestDate, AssetImportanceId, CriticalLevelId, UseAsEquipment, LastModified, IntranetCreatedBy, NotSFG20, HasSFG20Job FROM ATAssets ast ORDER BY UID LIMIT 100", []);

                echo json_encode(['data' => $assets]);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){

                //return bad http request when error is encountered
                http_response_code(400);
            }                          
            break;    

        case 'get_work_order':
            try{
                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);
                $work_order = select($connection, "SELECT * FROM PMJobs ORDER BY UID", []);

                echo json_encode(['data' => $work_order]);

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
                $client = select($connection, "SELECT COUNT(UID) AS tot_col, (CASE 
                    WHEN tc.Client IS NULL THEN 'Empty'
                    ELSE tc.Client
                    END) AS col_name
                    FROM TabsBuildings tb INNER JOIN TabsClients tc ON tc.ID = tb.Client GROUP BY tc.Client", []);
                $temp['Client'] = $client;

                $region = select($connection, "SELECT COUNT(tr.UID) AS tot_col, (CASE WHEN tr.RegionName IS NULL THEN 'Empty' ELSE tr.RegionName END) AS col_name 
                    FROM TabsBuildings tb INNER JOIN TabsRegions tr ON tb.Region = tr.UID GROUP BY tr.RegionName", []);
                $temp['Region'] = $region;

                $building_name = select($connection, "SELECT COUNT(UID) AS tot_col, (CASE 
                    WHEN BuildingName IS NULL THEN 'Empty'
                    ELSE BuildingName
                    END) AS col_name
                    FROM TabsBuildings GROUP BY BuildingName", []);
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

            case 'get_asset_list_sidebar_dataset':
            try{
                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);

                $temp = [];
                $client = select($connection, "SELECT COUNT(UID) AS tot_col, (CASE 
                    WHEN Client IS NULL THEN 'Empty'
                    ELSE Client
                    END) AS col_name
                    FROM assets GROUP BY Client LIMIT 50", []);
                $temp['Client'] = $client;

                $region = select($connection, "SELECT COUNT(UID) AS tot_col, (CASE 
                    WHEN Region IS NULL THEN 'Empty'
                    ELSE Region
                    END) AS col_name
                    FROM assets GROUP BY Region LIMIT 50", []);
                $temp['Region'] = $region;

                $building_name = select($connection, "SELECT COUNT(UID) AS tot_col, (CASE 
                    WHEN BuildingName IS NULL THEN 'Empty'
                    ELSE BuildingName
                    END) AS col_name
                    FROM assets GROUP BY BuildingName LIMIT 50", []);
                $temp['BuildingName'] = $building_name;

                $Group1 = select($connection, "SELECT COUNT(UID) AS tot_col, (CASE 
                    WHEN Group1 IS NULL THEN 'Empty'
                    ELSE Group1
                    END) AS col_name
                    FROM assets GROUP BY Group1", []);
                $temp['Group1'] = $Group1;

                $Description = select($connection, "SELECT COUNT(UID) AS tot_col, (CASE 
                    WHEN Description IS NULL THEN 'Empty'
                    ELSE Description
                    END) AS col_name
                    FROM assets GROUP BY Description LIMIT 50", []);
                $temp['Description'] = $Group1;

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
                    FROM TabsBuildingContacts GROUP BY Name", []);
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
                  $client = select($connection, "SELECT COUNT(Building) AS tot_col, (CASE 
                    WHEN Client IS NULL THEN 'Empty'
                    ELSE Client
                    END) AS col_name
                    FROM COContracts GROUP BY Client", []);
                $temp['Client'] = $client;

                $region = select($connection, "SELECT COUNT(Building) AS tot_col, (CASE 
                    WHEN Region IS NULL THEN 'Empty'
                    ELSE Region
                    END) AS col_name
                    FROM COContracts GROUP BY Region", []);
                $temp['Region'] = $region;

                $building_name = select($connection, "SELECT COUNT(Building) AS tot_col, (CASE 
                    WHEN Building IS NULL THEN 'Empty'
                    ELSE Building
                    END) AS col_name
                    FROM COContracts GROUP BY Building", []);
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
                $building = select($connection, sprintf("SELECT * FROM TabsBuildings WHERE %s ", $where_clauses), []);

                echo json_encode(['data' => $building]);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                //return bad http request when error is encountered
                http_response_code(400);
            }
            break;
                case 'get_filtered_dataset_asset_list':
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
                $building = select($connection, sprintf("SELECT * FROM ATAssets WHERE %s LIMIT 500 ", $where_clauses), []);

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
                $contacts = select($connection, sprintf("SELECT * FROM TabsBuildingContacts WHERE %s ", $where_clauses), []);

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
                $contracts = select($connection, sprintf("SELECT * FROM contracts WHERE %s ", $where_clauses), []);

                echo json_encode(['data' => $contracts]);

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
                $filters = empty($filters)?"*":$filters;

                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);
                $dataset = select($connection, sprintf("SELECT %s FROM %s LIMIT 500", $filters, $_REQUEST['table']), []);

                echo json_encode(['data' => $dataset]);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                //return bad http request when error is encountered
                http_response_code(400);
            }
            break;
        case 'get_work_priority':
            try{
                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);
                $priority = select($connection, "SELECT COUNT(Priority) AS tot_priority, Priority 
                    FROM PMJobs
                    GROUP BY Priority", []);

                echo json_encode(['data' => $priority]);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                //return bad http request when error is encountered
                http_response_code(400);
            }
            break;
        case 'get_work_type':
            try{
                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);
                $priority = select($connection, "SELECT COUNT(JobType) AS tot_job_type, JobType FROM PMJobs GROUP BY JobType", []);

                echo json_encode(['data' => $priority]);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                //return bad http request when error is encountered
                http_response_code(400);
            }
            break;
        case 'upload_file':
            $file_type = $_REQUEST['file_type'];
            $destination = sprintf("uploads/files/%s.%s", $_REQUEST['file_name'], $_REQUEST['file_type']);
            $target_dir = sprintf("../%s", $destination);

            switch($file_type){
                case 'json':
                    file_put_contents($target_dir, $_REQUEST['file_data']);
                    break;
                case 'csv':
                    $dataset = json_decode($_REQUEST['file_data'], true);  
                    $headers = array_keys($dataset[0]);
                    $values = array_values($dataset);

                    $fp = fopen($target_dir, 'w');
                    fputcsv($fp, $headers);

                    foreach ($values as $v) {
                        fputcsv($fp, $v);
                    }

                    fclose($fp);
                    break;
                case 'xml':
                    $dataset = json_decode($_REQUEST['file_data'], true);  
                    $fields = array_values($dataset);

                    $doc = new DOMDocument();
                    $doc->formatOutput = true;

                    $doc_root = $doc->createElement("root");
                    $doc->appendChild( $doc_root );

                    foreach( $fields AS  $k => $f_block){
                        $parent_node = $doc->createElement(sprintf("grid_%s", $_REQUEST['file_name']));
                        foreach($f_block AS $z => $v){
                            $el = $doc->createElement( $z, $v );
                            $parent_node->appendChild($el);
                        }
                        $doc_root->appendChild($parent_node);
                    }

                    $xml_dump = $doc->saveXML();
                    file_put_contents($target_dir, $xml_dump);
                    break;
            }

            echo json_encode(["path" => $destination, "file_name" => basename($target_dir)]);

            break;
        case 'get_site_summary':
            try{
                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);
                $building = select($connection, "SELECT * FROM TabsBuildings WHERE BuildingNumber = ? LIMIT 1", [$_REQUEST['building_id']]);

                echo json_encode(['data' => $building]);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                //return bad http request when error is encountered
                http_response_code(400);
            }
            break;
        case 'get_building_by_uid':
            try{
                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);
                $building = select($connection, "SELECT * FROM TabsBuildings WHERE UID = ?", [$_REQUEST['building_id']]);

                echo json_encode(['data' => $building]);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                //return bad http request when error is encountered
                http_response_code(400);
            }
            break;
        case 'get_col_grp':
            try{
                $cols = json_decode($_REQUEST['fields'], true);
                $temp = [];

                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);

                foreach($cols AS $v){
                    $_pos = strpos($v, ".")  + 1;

                    if($_pos !== FALSE){
                        $v_col = substr($v, $_pos);
                    }

                    $sql = sprintf("SELECT %s FROM %s c INNER JOIN TabsClients tc ON c.Client = tc.ID INNER JOIN TabsRegions tr ON c.Region = tr.UID GROUP BY %s", $v, $_REQUEST['table'], $v);
                    $temp[$v_col] = select($connection, $sql, []);
                }

                echo json_encode(['data' => $temp]);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                //return bad http request when error is encountered
                http_response_code(400);
            }
            break;
        case 'get_col_values':
            try{
                $cols = json_decode($_REQUEST['filters'], true);
                $temp = [];
                $date_count = [];

                foreach($cols AS $k => $v){
                    $a = ['begin_date', 'end_date'];
                    if(!in_array($k, $a))
                        $temp[] = sprintf(" %s = '%s' ", $k, $v);
                }

                $filters = implode("AND", $temp);

                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);

                $dataset = [];
                foreach($cols AS $v){
                    $dataset = select($connection, sprintf("SELECT c.UID, c.BuildingPicture, c.SiteNumber, tc.Client, c.Address, c.PostCode, c.Phone, c.Fax, tr.RegionName, c.SubRegion, tc.Email, c.Landlord, c.InsuranceBroker, c.EstatesManager, c.RegionalOperationsManager, c.VixenReactive, c.VixenPPM, c.LocalAuthority FROM %s  c INNER JOIN TabsClients tc ON c.Client = tc.ID INNER JOIN TabsRegions tr ON c.Region = tr.UID WHERE %s", $_REQUEST['table'], $filters), []);
                }

                if(!empty($dataset)){
                    $con_dates = !empty($_REQUEST['date_begin']) && !empty($_REQUEST['date_end']);

                    $date_partial_sql = $con_dates?"AND pmj.DateCreated >= DATE(?) AND pmj.DateCreated <= DATE(?)":'';
                    $val_array = [$dataset[0]['UID']];

                    if($con_dates)
                        $val_array = array_merge([$dataset[0]['UID']], [$_REQUEST['date_begin'], $_REQUEST['date_end']]);


                    $dataset['interventions'] = select($connection, sprintf("SELECT COUNT(pmj.UID) AS number_intervention, tb.BuildingName, pmjd.Description AS intervention_desc, StartDate, pms.Status AS CurrentStatus, ast.AssetCode FROM PMJobs pmj INNER JOIN PMJobDescriptions pmjd ON pmj.UID = pmjd.UID INNER JOIN PMStatusLevels pms ON pmj.CurrentStatus = pms.UID LEFT JOIN ATAssets ast ON ast.AssetCode = pmj.AssetCode INNER JOIN TabsBuildings tb ON tb.UID = pmj.Building WHERE Building = ? %s GROUP BY pmj.Building, pmjd.Description, pmj.StartDate, CurrentStatus, ast.AssetCode", $date_partial_sql),
                        $val_array);

                    $dataset_date = select($connection, sprintf("SELECT StartDate FROM PMJobs pmj WHERE Building = ? %s", $date_partial_sql), $val_array);

                    foreach($dataset_date AS $v){
                        $dt = new DateTime($v['StartDate']);
                        $key = $dt->format('M/Y');

                        if(!array_key_exists($key, $date_count)){
                            $date_count[$key] = 0;
                        }else{
                            $date_count[$key]++;
                        }
                        
                    }

                    $dataset_type = select($connection, sprintf("SELECT Count(pmj.JobNumber) AS jobcount, pj.description FROM PMJobs pmj, PMJobDescriptions pj  WHERE Building = ? and pmj.JobDescription = pj.UID %s GROUP BY pmj.JobDescription", $date_partial_sql), $val_array);

                    $dataset_action = select($connection, sprintf("SELECT Count(pmj.JobNumber) AS jobcount, pj.Name FROM PMJobs pmj, PMWorkTypes pj
                        WHERE Building = ? and pmj.JobType = pj.UID %s
                        GROUP BY pj.Name", $date_partial_sql), $val_array);

                    $dataset_status = select($connection, sprintf("SELECT Count(pmj.JobNumber) AS jobcount, pj.Status AS CurrentStatus FROM PMJobs pmj, PMStatusLevels pj WHERE Building = ? and 
                        pmj.CurrentStatus = pj.UID %s GROUP BY pj.Status", $date_partial_sql), $val_array);

                    $dataset_priority = select($connection, sprintf("SELECT Count(pmj.JobNumber) AS jobcount, Priority FROM PMJobs pmj WHERE Building = ? %s GROUP BY 2", $date_partial_sql), $val_array);

                    // $dataset_service_provider = select($connection, "SELECT Count(pmj.JobNumber) AS jobcount, tup.WorkerName FROM PMJobs pmj INNER JOIN TabsUserProfiles tup ON pmj.Worker = tup.UID WHERE Building = 5 GROUP BY pmj.WorkerName", [$dataset[0]['UID']]);

                    $dataset['chart']['intervention_date'] = $date_count;
                    $dataset['chart']['intervention_type'] = $dataset_type;
                    $dataset['chart']['intervention_action'] = $dataset_action;
                    $dataset['chart']['intervention_status'] = $dataset_status;
                    $dataset['chart']['intervention_priority'] = $dataset_priority;
                    // $dataset['chart']['intervention_service_provider'] = $dataset_service_provider;
                }

                echo json_encode(['data' =>  $dataset]);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                echo $e->getMessage();
                //return bad http request when error is encountered
                http_response_code(400);
            }            
            break;
        case 'update_map':
            try{
                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);

                exec_sql(
                    $connection,
                    'UPDATE buildings SET Longitude = ?, Latitude = ? WHERE UID = ?',
                    [doubleval($_REQUEST['Longitude']), doubleval($_REQUEST['Latitude']), $_REQUEST['UID']]
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
        case 'get_finance':
            try{
                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);
                $dataset = select($connection, "SELECT Count(pmj.JobNumber) AS jobcount, pmjd.Description AS WorkType FROM PMJobs pmj INNER JOIN PMJobDescriptions pmjd ON pmj.UID = pmjd.UID GROUP BY pmjd.Description", []);

                echo json_encode(['data' => $dataset]);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                //return bad http request when error is encountered
                http_response_code(400);
            }
            break;
        case 'get_contractor':
            try{
                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);
                $dataset = select($connection, "SELECT Count(pmj.JobNumber) AS jobcount, pms.Status AS CurrentStatus FROM PMJobs pmj INNER JOIN PMStatusLevels pms ON pmj.CurrentStatus = pms.UID
                    GROUP BY pms.Status", []);

                echo json_encode(['data' => $dataset]);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                //return bad http request when error is encountered
                http_response_code(400);
            }
            break;
        case 'get_asset_summary':
            try{
                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);
                $dataset = select($connection, "SELECT Count(pmj.JobNumber) AS jobcount, pmjd.Description FROM PMJobs pmj INNER JOIN PMJobDescriptions pmjd ON pmj.UID = pmjd.UID GROUP BY pmjd.Description", []);

                echo json_encode(['data' => $dataset]);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                //return bad http request when error is encountered
                http_response_code(400);
            }
            break;
        case 'col_to_json':
            $fields = json_decode($_REQUEST["fields_"]);
            $table = $_REQUEST['table'];

            $file = fopen("col_transform.json","r");
            $file_size = filesize("col_transform.json");
            $contents = fread($file,"100000");
            $out_file = null;

            if($file_size == 0){

                $array = [];
                $array[$table] = $fields;
                $out_file = json_encode($array,JSON_PRETTY_PRINT);

            }else{
                $contents_ = json_decode($contents, true);
                $keys = array_keys($contents_);

                $contents_[$table] = $fields;
                $out_file = json_encode($contents_,JSON_PRETTY_PRINT);
            }

            fclose($file);

            $file = fopen("col_transform.json","w");

            if(!empty($out_file)){
                fwrite($file, $out_file);
            }

            fclose($file);

            echo json_encode(['status' => 200]);
            break;
        case 'get_col_json':
            $file = fopen("col_transform.json","r");
            $file_size = filesize("col_transform.json");
            $contents = fread($file,"100000");
            $out_json = null;

            if($file_size !== 0){
                $contents_ = json_decode($contents, true);
                $keys = array_keys($contents_);

                if(array_key_exists($_REQUEST['table'], $contents_)){
                    $out_json = $contents_[$_REQUEST['table']];
                }
                
            }
            
            fclose($file);
            echo json_encode(['data' => $out_json]);

            break;
        case 'get_building_uid':
            try{
                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);
                $dataset = select($connection, "SELECT UID, BuildingName FROM TabsBuildings ORDER BY UID", []);

                echo json_encode(['data' => $dataset]);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                //return bad http request when error is encountered
                http_response_code(400);
            }
            break;
        case 'file_upload':
            try{
                $target_dir = "../uploads/images/";
                $target_file = $target_dir.basename($_FILES["file"]["name"][0]);
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);

                $mv = move_uploaded_file($_FILES["file"]["tmp_name"][0], $target_file);
                if($mv){
                    exec_sql(
                        $connection,
                        'INSERT INTO bimage ( UID, bimage ) VALUES (?, ?)',
                        [intval($_REQUEST['building_image_uid']),$target_file]
                    );
                }

                echo json_encode(['status' => ($mv)?'true':'false']);
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                //return bad http request when error is encountered
                http_response_code(400);
            }
            break;
        case 'get_bimage':
            try{
                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);
                $dataset = select($connection, "SELECT b.UID, b.bimage, tb.BuildingName FROM bimage b INNER JOIN TabsBuildings tb ON b.UID = tb.UID ORDER BY b.UID", []);

                echo json_encode(['data' => $dataset]);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                //return bad http request when error is encountered
                http_response_code(400);
            }
            break;
        case 'get_work_orders':
            try{
                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);
                $dataset = select($connection, "SELECT COUNT(Client) AS tot_client, Client FROM PMJobs GROUP BY Client", []);

                echo json_encode(['data' => $dataset]);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                //return bad http request when error is encountered
                http_response_code(400);
            }
            break;
        case 'update_selection_fields':
            try{

                $dataset = [];
                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);

                if($_REQUEST['selection_type'] == 'client_selection'){

                    $buildings = select($connection, "SELECT tb.BuildingName, tb.Region FROM TabsBuildings tb INNER JOIN TabsClients tc ON tb.Client = tc.ID WHERE tc.Client = ?", [$_REQUEST['select_val']]);

                    $regions = [];
                    foreach($buildings AS $k => $v){
                        $temp = select($connection, 'SELECT tr.RegionName FROM TabsBuildings tb INNER JOIN TabsRegions tr ON tb.Region = tr.UID WHERE tr.UID = ?', [$v['Region']]);

                        if(!empty($temp)){
                            if(empty($regions)){
                                $regions[] = $temp[0];
                            }else{
                                foreach($regions AS $x => $y){
                                    if($y['RegionName'] != $temp[0]['RegionName']){
                                        $regions[] = $temp[0];
                                    }
                                }
                            }
                        }
                    }

                    $dataset['regions'] = $regions;
                    $dataset['buildings'] = $buildings;

                }else if($_REQUEST['selection_type'] == 'region_selection'){

                    $buildings = select($connection, 'SELECT tb.BuildingName FROM TabsBuildings tb INNER JOIN TabsRegions tr ON tb.Region = tr.UID WHERE tr.RegionName = ?', [$_REQUEST['select_val']]);
                    $dataset['buildings'] = $buildings;

                }

                echo json_encode(['data' => $dataset]);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                //return bad http request when error is encountered
                http_response_code(400);
            }
            break;
        case 'get_page_setting':
            try{
                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);
                $dataset = select($connection, "SELECT * FROM tbl_setting LIMIT 1", []);

                echo json_encode(['data' => $dataset]);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                //return bad http request when error is encountered
                http_response_code(400);
            }
            break;
        case 'insert_date':
            try{
                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);

                exec_sql($connection,'TRUNCATE tbl_setting',[]);

                exec_sql(
                    $connection,
                    'INSERT INTO tbl_setting (date_format, date_locale) VALUES(?, ?)',
                    [$_REQUEST['date_format'], $_REQUEST['date_locale']]
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
        case 'report_card':
            try{
                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);

                $cols = json_decode($_REQUEST['filters'], true);
                $temp = [];
                $date_count = [];

                foreach($cols AS $k => $v){
                    $a = ['begin_date', 'end_date'];
                    if(!in_array($k, $a))
                        $temp[] = sprintf(" %s = '%s' ", $k, $v);
                }

                $filters = implode("AND", $temp);

                $dataset = [];
                foreach($cols AS $v){
                    $dataset = select($connection, sprintf("SELECT c.UID, c.BuildingPicture, c.SiteNumber, tc.Client, c.Address, c.PostCode, c.Phone, c.Fax, tr.RegionName, c.SubRegion, tc.Email, c.Landlord, c.InsuranceBroker, c.EstatesManager, c.RegionalOperationsManager, c.VixenReactive, c.VixenPPM, c.LocalAuthority FROM %s  c INNER JOIN TabsClients tc ON c.Client = tc.ID INNER JOIN TabsRegions tr ON c.Region = tr.UID WHERE %s", $_REQUEST['table'], $filters), []);
                }

                $repair_jobs = [];
                $live_job_status = [];
                $maintenance_jobs = [];

                $date_partial_sql = "";
                if(!empty($dataset)){
                    $con_dates = !empty($_REQUEST['date_begin']) && !empty($_REQUEST['date_end']);

                    $date_partial_sql = $con_dates?"AND pmj.DateCreated >= DATE(?) AND pmj.DateCreated <= DATE(?)":'';
                    $val_array = [$dataset[0]['UID']];

                    if($con_dates)
                        $val_array = array_merge([$dataset[0]['UID']], [$_REQUEST['date_begin'], $_REQUEST['date_end']]);

                    $repair_jobs = select($connection, sprintf("SELECT pmj.JobNumber, pmj.DateCreated, pmj.DateCompleted, 
                        IF(DATEDIFF(DATE(pmj.EstimatedCompletionDateTime), DATE(pmj.DateCreated))<0, 0, DATEDIFF(DATE(pmj.EstimatedCompletionDateTime), DATE(pmj.DateCreated))) AS completion_timescale, DATE_ADD(pmj.DateCreated, INTERVAL IF(DATEDIFF(DATE(pmj.EstimatedCompletionDateTime), DATE(pmj.DateCreated))<0, 0, DATEDIFF(DATE(pmj.EstimatedCompletionDateTime), DATE(pmj.DateCreated))) DAY) AS completion_date,
                        CASE
                            WHEN DATE(NOW()) <= DATE_ADD(pmj.DateCreated, INTERVAL IF(DATEDIFF(DATE(pmj.EstimatedCompletionDateTime), DATE(pmj.DateCreated))<0, 0, DATEDIFF(DATE(pmj.EstimatedCompletionDateTime), DATE(pmj.DateCreated))) DAY) THEN 'in_sla'
                            WHEN DATE(NOW()) > DATE_ADD(pmj.DateCreated, INTERVAL IF(DATEDIFF(DATE(pmj.EstimatedCompletionDateTime), DATE(pmj.DateCreated))<0, 0, DATEDIFF(DATE(pmj.EstimatedCompletionDateTime), DATE(pmj.DateCreated))) DAY) THEN 'out_sla'
                            ELSE 'out_sla'
                        END AS job_completion_status
                        FROM PMJobs pmj WHERE pmj.PPMGroup = 0 AND pmj.DateCompleted IS NULL AND Building = ? %s", $date_partial_sql), $val_array);

                    $maintenance_jobs = select($connection, sprintf("SELECT pmj.JobNumber, pmj.DateCreated, pmj.DateCompleted, 
                        IF(DATEDIFF(DATE(pmj.EstimatedCompletionDateTime), DATE(pmj.DateCreated))<0, 0, DATEDIFF(DATE(pmj.EstimatedCompletionDateTime), DATE(pmj.DateCreated))) AS completion_timescale, DATE_ADD(pmj.DateCreated, INTERVAL IF(DATEDIFF(DATE(pmj.EstimatedCompletionDateTime), DATE(pmj.DateCreated))<0, 0, DATEDIFF(DATE(pmj.EstimatedCompletionDateTime), DATE(pmj.DateCreated))) DAY) AS completion_date,
                        CASE
                            WHEN DATE(NOW()) <= DATE_ADD(pmj.DateCreated, INTERVAL IF(DATEDIFF(DATE(pmj.EstimatedCompletionDateTime), DATE(pmj.DateCreated))<0, 0, DATEDIFF(DATE(pmj.EstimatedCompletionDateTime), DATE(pmj.DateCreated))) DAY) THEN 'in_sla'
                            WHEN DATE(NOW()) > DATE_ADD(pmj.DateCreated, INTERVAL IF(DATEDIFF(DATE(pmj.EstimatedCompletionDateTime), DATE(pmj.DateCreated))<0, 0, DATEDIFF(DATE(pmj.EstimatedCompletionDateTime), DATE(pmj.DateCreated))) DAY) THEN 'out_sla'
                            ELSE 'out_sla'
                        END AS job_completion_status
                        FROM PMJobs pmj WHERE pmj.PPMGroup <> 0 AND pmj.DateCompleted IS NULL AND Building = ? %s", $date_partial_sql), $val_array);

                    $maintenance_jobs = select($connection, sprintf("SELECT pmj.JobNumber, pmj.DateCreated, pmj.DateCompleted, 
                        IF(DATEDIFF(DATE(pmj.EstimatedCompletionDateTime), DATE(pmj.DateCreated))<0, 0, DATEDIFF(DATE(pmj.EstimatedCompletionDateTime), DATE(pmj.DateCreated))) AS completion_timescale, DATE_ADD(pmj.DateCreated, INTERVAL IF(DATEDIFF(DATE(pmj.EstimatedCompletionDateTime), DATE(pmj.DateCreated))<0, 0, DATEDIFF(DATE(pmj.EstimatedCompletionDateTime), DATE(pmj.DateCreated))) DAY) AS completion_date,
                        CASE
                            WHEN DATE(NOW()) <= DATE_ADD(pmj.DateCreated, INTERVAL IF(DATEDIFF(DATE(pmj.EstimatedCompletionDateTime), DATE(pmj.DateCreated))<0, 0, DATEDIFF(DATE(pmj.EstimatedCompletionDateTime), DATE(pmj.DateCreated))) DAY) THEN 'in_sla'
                            WHEN DATE(NOW()) > DATE_ADD(pmj.DateCreated, INTERVAL IF(DATEDIFF(DATE(pmj.EstimatedCompletionDateTime), DATE(pmj.DateCreated))<0, 0, DATEDIFF(DATE(pmj.EstimatedCompletionDateTime), DATE(pmj.DateCreated))) DAY) THEN 'out_sla'
                            ELSE 'out_sla'
                        END AS job_completion_status
                        FROM PMJobs pmj WHERE pmj.PPMGroup <> 0 AND pmj.DateCompleted IS NULL AND Building = ? %s", $date_partial_sql), $val_array);

                    $live_job_status = select($connection, sprintf("SELECT COUNT(pmj.UID) AS number_intervention, pms.Status AS CurrentStatus FROM PMJobs pmj INNER JOIN PMStatusLevels pms ON pmj.CurrentStatus = pms.UID
                        WHERE pmj.DateCompleted IS NULL AND Building = ? %s GROUP BY pms.Status", $date_partial_sql), $val_array);

                    $job_priorities = select($connection, sprintf("SELECT COUNT(pmp.UID) AS number_intervention, pmp.Priority AS CurrentStatus FROM PMPriorities pmp INNER JOIN PMJobs pmj ON pmj.Priority = pmp.UID
                        WHERE pmj.DateCompleted IS NULL AND Building = ? %s GROUP BY pmp.Priority", $date_partial_sql), $val_array);
                }

                

                $repair_jobs_stats = ["in_sla" => 0, "out_sla" => 0, "unkown"];
                foreach($repair_jobs AS $k => $v){
                    $repair_jobs_stats[$v["job_completion_status"]]++;
                }

                $maintenance_jobs_stats = ["in_sla" => 0, "out_sla" => 0];
                foreach($maintenance_jobs AS $k => $v){
                    $maintenance_jobs_stats[$v["job_completion_status"]]++;
                }

                $temp_ = [
                    'repair_jobs' => $repair_jobs_stats,
                    'live_job_status' => $live_job_status,
                    'maintenance_jobs' => $maintenance_jobs_stats,
                    'jobs_today' => count($repair_jobs) + count($maintenance_jobs),
                    'job_priorities' => $job_priorities
                ];

                echo json_encode(['data' => $temp_]);

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