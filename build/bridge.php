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
                $building = select($connection, "SELECT b.UID, b.BuildingName, b.VixenReactive, b.VixenPPM, tc.Client FROM TabsBuildings b
                    INNER JOIN TabsClients tc ON b.Client = tc.ID WHERE b.VixenReactive <> 'NULL' AND b.VixenPPM <> 'NULL'", []);

                echo json_encode(['data' => $building]);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                //return bad http request when error is encountered
                http_response_code(400);
            }
            break;
        case 'get_atomic_building_point':
            try{
                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);
                $building = select($connection, "SELECT b.UID, b.VixenReactive, b.VixenPPM FROM TabsBuildings b WHERE b.UID = ?", [$_REQUEST['building_id']]);

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

                if(isset($_REQUEST['building_id']))
                    $building = select($connection, "SELECT * FROM TabsBuildings WHERE UID = ? ORDER BY UID", [$_REQUEST['building_id']]);
                else
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

        case 'get_col_grp_jobs':
            try{
                $cols = json_decode($_REQUEST['fields'], true);
                $temp = [];

                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);

                $alias = ['job_type' => 'Description'];

                foreach($cols AS $v){
                    $_pos = strpos($v, ".")  + 1;

                    if($_pos !== FALSE){
                        $v_col = substr($v, $_pos);
                    }

                    $v_temp = $v;
                    if(in_array($v_col, array_keys($alias))){
                        $v_temp = sprintf("%s AS %s", str_replace($v_col, $alias[$v_col], $v), $v_col);
                        $v = $v_col;
                    }

                    $sql = sprintf("SELECT %s FROM %s c 
                    INNER JOIN TabsClients tc ON c.Client = tc.ID 
                    INNER JOIN TabsRegions tr ON c.Region = tr.UID 
                    INNER JOIN PMJobs pmj ON pmj.Building = c.UID
                    INNER JOIN PMJobDescriptions pmjd ON pmj.JobType = pmjd.UID 
                    INNER JOIN PMWorkTypes pmwt ON pmjd.WorkType = pmwt.UID
                    INNER JOIN PMPriorities pmp ON pmp.UID = pmj.Priority 
                    INNER JOIN PMStatusLevels pmsl ON pmsl.UID = pmj.CurrentStatus GROUP BY %s", $v_temp, $_REQUEST['table'], $v);

                    $temp[$v_col] = select($connection, $sql, []);
                }

                echo json_encode(['data' => $temp]);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                echo $e->getMessage();
                //return bad http request when error is encountered
                http_response_code(400);
            }            
            break;
        case 'get_col_grp_finance':
            try{
                $cols = json_decode($_REQUEST['fields'], true);
                $temp = [];

                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);

                $alias = ['job_type' => 'Description'];

                foreach($cols AS $v){
                    $_pos = strpos($v, ".")  + 1;

                    if($_pos !== FALSE){
                        $v_col = substr($v, $_pos);
                    }

                    $v_temp = $v;
                    if(in_array($v_col, array_keys($alias))){
                        $v_temp = sprintf("%s AS %s", str_replace($v_col, $alias[$v_col], $v), $v_col);
                        $v = $v_col;
                    }

                    $sql = sprintf("SELECT %s FROM %s c 
                    INNER JOIN TabsClients tc ON c.Client = tc.ID 
                    INNER JOIN TabsRegions tr ON c.Region = tr.UID 
                    INNER JOIN PMJobs pmj ON pmj.Building = c.UID
                    INNER JOIN PMJobDescriptions pmjd ON pmj.JobType = pmjd.UID 
                    INNER JOIN PMWorkTypes pmwt ON pmjd.WorkType = pmwt.UID
                    INNER JOIN PMPriorities pmp ON pmp.UID = pmj.Priority 
                    INNER JOIN PMStatusLevels pmsl ON pmsl.UID = pmj.CurrentStatus GROUP BY %s", $v_temp, $_REQUEST['table'], $v);

                    $temp[$v_col] = select($connection, $sql, []);
                }

                echo json_encode(['data' => $temp]);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                echo $e->getMessage();
                //return bad http request when error is encountered
                http_response_code(400);
            }    
            break;
        case 'get_col_grp_worker':
            try{
                $cols = json_decode($_REQUEST['fields'], true);
                $temp = [];

                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);

                $alias = ['job_type' => 'Description'];

                foreach($cols AS $v){
                    $_pos = strpos($v, ".")  + 1;

                    if($_pos !== FALSE){
                        $v_col = substr($v, $_pos);
                    }

                    $v_temp = $v;
                    if(in_array($v_col, array_keys($alias))){
                        $v_temp = sprintf("%s AS %s", str_replace($v_col, $alias[$v_col], $v), $v_col);
                        $v = $v_col;
                    }

                    $sql = sprintf("SELECT %s FROM %s c 
                    INNER JOIN TabsClients tc ON c.Client = tc.ID 
                    INNER JOIN TabsRegions tr ON c.Region = tr.UID 
                    INNER JOIN PMJobs pmj ON pmj.Building = c.UID
                    INNER JOIN PMJobDescriptions pmjd ON pmj.JobType = pmjd.UID 
                    INNER JOIN PMWorkTypes pmwt ON pmjd.WorkType = pmwt.UID
                    INNER JOIN PMPriorities pmp ON pmp.UID = pmj.Priority 
                    INNER JOIN PMStatusLevels pmsl ON pmsl.UID = pmj.CurrentStatus GROUP BY %s", $v_temp, $_REQUEST['table'], $v);

                    $temp[$v_col] = select($connection, $sql, []);
                }

                echo json_encode(['data' => $temp]);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                echo $e->getMessage();
                //return bad http request when error is encountered
                http_response_code(400);
            }            
            break;

        case 'get_jobs':
            try{
                $cols = json_decode($_REQUEST['filters'], true);
                $temp = [];
                $date_count = [];

                foreach($cols AS $k => $v){
                    $a = ['begin_date', 'end_date', 'created_date'];
                    if(!in_array($k, $a))
                        $temp[] = sprintf(" %s = '%s' ", $k, $v);
                }

                $filters = implode("AND", $temp);

                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);

                $con_dates = !empty($_REQUEST['date_begin']) && !empty($_REQUEST['date_end']);

                $date_partial_sql = $con_dates?"AND pmj.DateCreated >= DATE(?) AND pmj.DateCreated <= DATE(?)":'';

                $val_array = [];
                if($con_dates)
                    $val_array = [$_REQUEST['date_begin'], $_REQUEST['date_end']];


                $dataset_temp = select($connection, sprintf("SELECT c.UID  FROM TabsBuildings c 
                INNER JOIN TabsClients tc ON c.Client = tc.ID 
                INNER JOIN TabsRegions tr ON c.Region = tr.UID 
                INNER JOIN PMJobs pmj ON pmj.Building = c.UID
                INNER JOIN PMJobDescriptions pmjd ON pmj.JobType = pmjd.UID 
                INNER JOIN PMWorkTypes pmwt ON pmjd.WorkType = pmwt.UID
                INNER JOIN PMPriorities pmp ON pmp.UID = pmj.Priority 
                INNER JOIN PMStatusLevels pmsl ON pmsl.UID = pmj.CurrentStatus WHERE %s %s GROUP BY c.UID", $filters, $date_partial_sql), []);

                $live_job_status = null;
                $job_priorities = null;
                $ds_job = null;
                if(!empty($dataset_temp)){
                    if($con_dates){
                        $val_array = array_merge([$dataset_temp[0]['UID']], [$_REQUEST['date_begin'], $_REQUEST['date_end']]);
                    }else{
                        $val_array = [$dataset_temp[0]['UID']];
                    }

                    $live_job_status = select($connection, sprintf("SELECT COUNT(pmj.UID) AS number_intervention, pms.Status AS CurrentStatus FROM PMJobs pmj INNER JOIN PMStatusLevels pms ON pmj.CurrentStatus = pms.UID
                        WHERE pmj.DateCompleted IS NULL AND Building = ? %s GROUP BY pms.Status ORDER BY pms.UID ASC", $date_partial_sql), $val_array);

                    $job_priorities = select($connection, sprintf("SELECT COUNT(pmp.UID) AS number_intervention, pmp.Priority AS CurrentStatus FROM PMPriorities pmp INNER JOIN PMJobs pmj ON pmj.Priority = pmp.UID
                        WHERE pmj.DateCompleted IS NULL AND Building = ? %s GROUP BY pmp.Priority ORDER BY pmp.UID ASC", $date_partial_sql), $val_array);

                    $ds_job = select($connection, sprintf("SELECT tc.Client, tr.RegionName, c.BuildingName, tl.LocationCode, pmj.JobNumber, pmwt.Name, pmjd.Description,
                        pmj.Comments, COALESCE(pmj.Schedule, 'N/A') AS Schedule, pmp.Priority, COALESCE(null, 'N/A') AS contractor_name, pmj.DateCreated, pmj.ReportedBy, pmj.CreatedBy,
                        pmj.StartDate, pmj.StartTime, pmj.CallLoggedDate, pmj.EstimatedRespondToDateTime, pmj.EstimatedCompletionDateTime, pmsl.Status AS CurrentStatus, pmj.ResponsesReceived, 
                        pmj.DateOfFirstResponse, pmj.LastModified AS LastChasedDate, pmj.JobComplete, pmj.DateCompleted, pmj.Cancelled, pmj.DateCancelled, pmj.FurtherWork, pmj.Resolved,
                        pmj.CostCode
                        FROM TabsBuildings c 
                        INNER JOIN TabsLocations tl ON tl.Building = c.UID
                        INNER JOIN TabsClients tc ON c.Client = tc.ID 
                        INNER JOIN TabsRegions tr ON c.Region = tr.UID 
                        INNER JOIN PMJobs pmj ON pmj.Building = c.UID
                        INNER JOIN PMJobDescriptions pmjd ON pmj.JobType = pmjd.UID 
                        INNER JOIN PMWorkTypes pmwt ON pmjd.WorkType = pmwt.UID
                        INNER JOIN PMPriorities pmp ON pmp.UID = pmj.Priority 
                        INNER JOIN PMStatusLevels pmsl ON pmsl.UID = pmj.CurrentStatus WHERE c.UID = ? %s", $date_partial_sql), $val_array);
                }   

                

                $job_dataset = [
                    'job' => $ds_job,
                    'live_job_status' => $live_job_status,
                    'job_priorities' => $job_priorities
                ];

                echo json_encode(['data' => $job_dataset]);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                echo $e->getMessage();
                //return bad http request when error is encountered
                http_response_code(400);
            }     
            break;
        case 'get_finance':
            try{
                $cols = json_decode($_REQUEST['filters'], true);
                $temp = [];
                $date_count = [];

                foreach($cols AS $k => $v){
                    $a = ['begin_date', 'end_date', 'created_date'];
                    if(!in_array($k, $a))
                        $temp[] = sprintf(" %s = '%s' ", $k, $v);
                }

                $filters = implode("AND", $temp);

                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);

                $con_dates = !empty($_REQUEST['date_begin']) && !empty($_REQUEST['date_end']);

                $date_partial_sql = $con_dates?"AND pmj.DateCreated >= DATE(?) AND pmj.DateCreated <= DATE(?)":'';

                $val_array = [];
                if($con_dates)
                    $val_array = [$_REQUEST['date_begin'], $_REQUEST['date_end']];


                $dataset_temp = select($connection, sprintf("SELECT c.UID  FROM TabsBuildings c 
                INNER JOIN TabsClients tc ON c.Client = tc.ID 
                INNER JOIN TabsRegions tr ON c.Region = tr.UID 
                INNER JOIN PMJobs pmj ON pmj.Building = c.UID
                INNER JOIN PMJobDescriptions pmjd ON pmj.JobType = pmjd.UID 
                INNER JOIN PMWorkTypes pmwt ON pmjd.WorkType = pmwt.UID
                INNER JOIN PMPriorities pmp ON pmp.UID = pmj.Priority 
                INNER JOIN PMStatusLevels pmsl ON pmsl.UID = pmj.CurrentStatus WHERE %s %s GROUP BY c.UID", $filters, $date_partial_sql), []);

                $live_finance_status = null;
                $finance_priorities = null;
                $ds_finance = null;
                if(!empty($dataset_temp)){
                    if($con_dates){
                        $val_array = array_merge([$dataset_temp[0]['UID']], [$_REQUEST['date_begin'], $_REQUEST['date_end']]);
                    }else{
                        $val_array = [$dataset_temp[0]['UID']];
                    }

                    $ds_finance = select($connection, sprintf("SELECT tc.Client, tr.RegionName, c.BuildingName, tl.LocationCode, pmj.JobNumber, pmwt.Name, pmjd.Description,
                        pmj.Comments, COALESCE(pmj.Schedule, 'N/A') AS Schedule, pmp.Priority, COALESCE(null, 'N/A') AS contractor_name, pmj.DateCreated, pmj.ReportedBy, pmj.CreatedBy,
                        pmj.StartDate, pmj.StartTime, pmj.CallLoggedDate, pmj.EstimatedRespondToDateTime, pmj.EstimatedCompletionDateTime, pmsl.Status AS CurrentStatus, pmj.ResponsesReceived, 
                        pmj.DateOfFirstResponse, pmj.LastModified AS LastChasedDate, pmj.JobComplete, pmj.DateCompleted, pmj.Cancelled, pmj.DateCancelled, pmj.FurtherWork, pmj.Resolved,
                        pmj.CostCode
                        FROM TabsBuildings c 
                        INNER JOIN TabsLocations tl ON tl.Building = c.UID
                        INNER JOIN TabsClients tc ON c.Client = tc.ID 
                        INNER JOIN TabsRegions tr ON c.Region = tr.UID 
                        INNER JOIN PMJobs pmj ON pmj.Building = c.UID
                        INNER JOIN PMJobDescriptions pmjd ON pmj.JobType = pmjd.UID 
                        INNER JOIN PMWorkTypes pmwt ON pmjd.WorkType = pmwt.UID
                        INNER JOIN PMPriorities pmp ON pmp.UID = pmj.Priority 
                        INNER JOIN PMStatusLevels pmsl ON pmsl.UID = pmj.CurrentStatus WHERE c.UID = ? %s", $date_partial_sql), $val_array);
                }   

                $finance_dataset = [
                    'finance' => $ds_finance
                ];

                echo json_encode(['data' => $finance_dataset]);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                echo $e->getMessage();
                //return bad http request when error is encountered
                http_response_code(400);
            }     
            break;
        case 'get_finance_expenditure':
            try{
                $cols = json_decode($_REQUEST['filters'], true);
                $temp = [];
                $date_count = [];

                foreach($cols AS $k => $v){
                    $a = ['begin_date', 'end_date', 'created_date'];
                    if(!in_array($k, $a))
                        $temp[] = sprintf(" %s = '%s' ", $k, $v);
                }

                $filters = implode("AND", $temp);

                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);

                $con_dates = !empty($_REQUEST['date_begin']) && !empty($_REQUEST['date_end']);

                $date_partial_sql = $con_dates?"AND pmj.DateCreated >= DATE(?) AND pmj.DateCreated <= DATE(?)":'';

                $val_array = [];
                if($con_dates)
                    $val_array = [$_REQUEST['date_begin'], $_REQUEST['date_end']];


                $dataset_temp = select($connection, sprintf("SELECT c.UID  FROM TabsBuildings c 
                INNER JOIN TabsClients tc ON c.Client = tc.ID 
                INNER JOIN TabsRegions tr ON c.Region = tr.UID 
                INNER JOIN PMJobs pmj ON pmj.Building = c.UID
                INNER JOIN PMJobDescriptions pmjd ON pmj.JobType = pmjd.UID 
                INNER JOIN PMWorkTypes pmwt ON pmjd.WorkType = pmwt.UID
                INNER JOIN PMPriorities pmp ON pmp.UID = pmj.Priority 
                INNER JOIN PMStatusLevels pmsl ON pmsl.UID = pmj.CurrentStatus WHERE %s %s GROUP BY c.UID", $filters, $date_partial_sql), []);

                $live_finance_status = null;
                $finance_priorities = null;
                $ds_finance = null;
                if(!empty($dataset_temp)){
                    if($con_dates){
                        $val_array = array_merge([$dataset_temp[0]['UID']], [$_REQUEST['date_begin'], $_REQUEST['date_end']]);
                    }else{
                        $val_array = [$dataset_temp[0]['UID']];
                    }

                    $ds_finance = select($connection, sprintf("SELECT pmwt.Name, FLOOR(RAND()*(100000-1000+1)+1000) AS WorkCost
                        FROM PMJobs pmj
                        INNER JOIN PMJobDescriptions pmjd ON pmj.JobType = pmjd.UID 
                        INNER JOIN PMWorkTypes pmwt ON pmjd.WorkType = pmwt.UID
                        WHERE pmj.Building = ? %s GROUP BY pmwt.Name", $date_partial_sql), $val_array);
                }   

                $finance_dataset = [
                    'finance' => $ds_finance
                ];

                echo json_encode(['data' => $finance_dataset]);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                echo $e->getMessage();
                //return bad http request when error is encountered
                http_response_code(400);
            }     
            break;
        case 'get_worker':
            try{
                $cols = json_decode($_REQUEST['filters'], true);
                $temp = [];
                $date_count = [];

                foreach($cols AS $k => $v){
                    $a = ['begin_date', 'end_date', 'created_date'];
                    if(!in_array($k, $a))
                        $temp[] = sprintf(" %s = '%s' ", $k, $v);
                }

                $filters = implode("AND", $temp);

                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);

                $con_dates = !empty($_REQUEST['date_begin']) && !empty($_REQUEST['date_end']);

                $date_partial_sql = $con_dates?"AND pmj.DateCreated >= DATE(?) AND pmj.DateCreated <= DATE(?)":'';

                $val_array = [];
                if($con_dates)
                    $val_array = [$_REQUEST['date_begin'], $_REQUEST['date_end']];


                $dataset_temp = select($connection, sprintf("SELECT c.UID  FROM TabsBuildings c 
                INNER JOIN TabsClients tc ON c.Client = tc.ID 
                INNER JOIN TabsRegions tr ON c.Region = tr.UID 
                INNER JOIN PMJobs pmj ON pmj.Building = c.UID
                INNER JOIN PMJobDescriptions pmjd ON pmj.JobType = pmjd.UID 
                INNER JOIN PMWorkTypes pmwt ON pmjd.WorkType = pmwt.UID
                INNER JOIN PMPriorities pmp ON pmp.UID = pmj.Priority 
                INNER JOIN PMStatusLevels pmsl ON pmsl.UID = pmj.CurrentStatus WHERE %s %s GROUP BY c.UID", $filters, $date_partial_sql), []);

                $live_worker_status = null;
                $worker_priorities = null;
                $ds_worker = null;
                if(!empty($dataset_temp)){
                    if($con_dates){
                        $val_array = array_merge([$dataset_temp[0]['UID']], [$_REQUEST['date_begin'], $_REQUEST['date_end']]);
                    }else{
                        $val_array = [$dataset_temp[0]['UID']];
                    }

                    $ds_worker = select($connection, sprintf("SELECT tc.Client, tr.RegionName, c.BuildingName, tl.LocationCode, pmj.JobNumber, pmwt.Name, pmjd.Description,
                        pmj.Comments, COALESCE(pmj.Schedule, 'N/A') AS Schedule, pmp.Priority, COALESCE(null, 'N/A') AS contractor_name, pmj.DateCreated, pmj.ReportedBy, pmj.CreatedBy,
                        pmj.StartDate, pmj.StartTime, pmj.CallLoggedDate, pmj.EstimatedRespondToDateTime, pmj.EstimatedCompletionDateTime, pmsl.Status AS CurrentStatus, pmj.ResponsesReceived, 
                        pmj.DateOfFirstResponse, pmj.LastModified AS LastChasedDate, pmj.JobComplete, pmj.DateCompleted, pmj.Cancelled, pmj.DateCancelled, pmj.FurtherWork, pmj.Resolved,
                        pmj.CostCode
                        FROM TabsBuildings c 
                        INNER JOIN TabsLocations tl ON tl.Building = c.UID
                        INNER JOIN TabsClients tc ON c.Client = tc.ID 
                        INNER JOIN TabsRegions tr ON c.Region = tr.UID 
                        INNER JOIN PMJobs pmj ON pmj.Building = c.UID
                        INNER JOIN PMJobDescriptions pmjd ON pmj.JobType = pmjd.UID 
                        INNER JOIN PMWorkTypes pmwt ON pmjd.WorkType = pmwt.UID
                        INNER JOIN PMPriorities pmp ON pmp.UID = pmj.Priority 
                        INNER JOIN PMStatusLevels pmsl ON pmsl.UID = pmj.CurrentStatus WHERE c.UID = ? %s", $date_partial_sql), $val_array);
                }   

                $worker_dataset = [
                    'worker' => $ds_worker
                ];

                echo json_encode(['data' => $worker_dataset]);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                echo $e->getMessage();
                //return bad http request when error is encountered
                http_response_code(400);
            }     
            break;
        case 'get_contractor':
            try{
                $cols = json_decode($_REQUEST['filters'], true);
                $temp = [];
                $date_count = [];

                foreach($cols AS $k => $v){
                    $a = ['begin_date', 'end_date', 'created_date'];
                    if(!in_array($k, $a))
                        $temp[] = sprintf(" %s = '%s' ", $k, $v);
                }

                $filters = implode("AND", $temp);

                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);

                $con_dates = !empty($_REQUEST['date_begin']) && !empty($_REQUEST['date_end']);

                $date_partial_sql = $con_dates?"AND pmj.DateCreated >= DATE(?) AND pmj.DateCreated <= DATE(?)":'';

                $val_array = [];
                if($con_dates)
                    $val_array = [$_REQUEST['date_begin'], $_REQUEST['date_end']];


                $dataset_temp = select($connection, sprintf("SELECT c.UID  FROM TabsBuildings c 
                INNER JOIN TabsClients tc ON c.Client = tc.ID 
                INNER JOIN TabsRegions tr ON c.Region = tr.UID 
                INNER JOIN PMJobs pmj ON pmj.Building = c.UID
                INNER JOIN PMJobDescriptions pmjd ON pmj.JobType = pmjd.UID 
                INNER JOIN PMWorkTypes pmwt ON pmjd.WorkType = pmwt.UID
                INNER JOIN PMPriorities pmp ON pmp.UID = pmj.Priority 
                INNER JOIN PMStatusLevels pmsl ON pmsl.UID = pmj.CurrentStatus WHERE %s %s GROUP BY c.UID", $filters, $date_partial_sql), []);

                $live_status = null;
                $contractor_priorities = null;
                $ds_contractor = null;
                if(!empty($dataset_temp)){
                    if($con_dates){
                        $val_array = array_merge([$dataset_temp[0]['UID']], [$_REQUEST['date_begin'], $_REQUEST['date_end']]);
                    }else{
                        $val_array = [$dataset_temp[0]['UID']];
                    }

                    $live_status = select($connection, sprintf("SELECT COUNT(pmj.UID) AS number_intervention, pms.Status AS CurrentStatus FROM PMJobs pmj INNER JOIN PMStatusLevels pms ON pmj.CurrentStatus = pms.UID
                        WHERE pmj.DateCompleted IS NULL AND Building = ? %s GROUP BY pms.Status ORDER BY pms.UID ASC", $date_partial_sql), $val_array);

                    $job_priorities = select($connection, sprintf("SELECT COUNT(pmp.UID) AS number_intervention, pmp.Priority AS CurrentStatus FROM PMPriorities pmp INNER JOIN PMJobs pmj ON pmj.Priority = pmp.UID
                        WHERE pmj.DateCompleted IS NULL AND Building = ? %s GROUP BY pmp.Priority ORDER BY pmp.UID ASC", $date_partial_sql), $val_array);

                    $ds_contractor = select($connection, sprintf("SELECT pmj.JobNumber, c.BuildingName, COALESCE(null, 'N/A') AS contractor_name, pmj.OrderNumber AS InvoiceNumber, COALESCE(null, 'N/A') AS NetAmount,
                        pmj.PaymentDate AS InvoiceDate, c.SiteNumber, pmwt.Name, pmj.JobDescription, pmj.DateCompleted, COALESCE(null, 'N/A') AS CompletedBy, pmj.Comments, COALESCE(null, 'N/A') AS NoReply,
                        CASE WHEN (pmjs.Happy = 1) THEN 'YES' ELSE 'NO' END AS Happy
                        FROM TabsBuildings c 
                        INNER JOIN TabsLocations tl ON tl.Building = c.UID
                        INNER JOIN TabsClients tc ON c.Client = tc.ID 
                        INNER JOIN TabsRegions tr ON c.Region = tr.UID 
                        INNER JOIN PMJobs pmj ON pmj.Building = c.UID
                        INNER JOIN PMJobDescriptions pmjd ON pmj.JobType = pmjd.UID 
                        INNER JOIN PMWorkTypes pmwt ON pmjd.WorkType = pmwt.UID
                        INNER JOIN PMPriorities pmp ON pmp.UID = pmj.Priority 
                        INNER JOIN PMJobSatisfactionSurveys pmjs ON pmjs.JobID = pmj.UID
                        INNER JOIN PMStatusLevels pmsl ON pmsl.UID = pmj.CurrentStatus WHERE c.UID = ? %s", $date_partial_sql), $val_array);
                }   

                $contractor_dataset = [
                    'contractor' => $ds_contractor
                ];

                echo json_encode(['data' => $contractor_dataset]);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                echo $e->getMessage();
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
        case 'get_col_grp_assets':
            try{
                $cols = json_decode($_REQUEST['fields'], true);
                $temp = [];

                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);
                $alias = ['asset_status' => 'Status'];

                foreach($cols AS $v){
                    $_pos = strpos($v, ".")  + 1;

                    if($_pos !== FALSE){
                        $v_col = substr($v, $_pos);
                    }

                    $v_temp = $v;
                    if(in_array($v_col, array_keys($alias))){
                        $v_temp = sprintf("%s AS %s", str_replace($v_col, $alias[$v_col], $v), $v_col);
                        $v = $v_col;
                    }

                    $sql = sprintf("SELECT %s FROM %s c INNER JOIN TabsClients tc ON c.Client = tc.ID INNER JOIN TabsRegions tr ON c.Region = tr.UID INNER JOIN PMJobs pmj ON c.UID = pmj.Building
                        INNER JOIN ATAssets ats ON pmj.AssetCode = ats.AssetCode INNER JOIN ATDescriptions atd ON ats.Description = atd.UID INNER JOIN ATGroups atg ON atd.GroupID = atg.UID 
                        INNER JOIN ATStatusLevels atl ON ats.StatusLevelID = atl.UID
                        GROUP BY %s", $v_temp, $_REQUEST['table'], $v);
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
        case 'get_col_grp_contractor':
            try{
                $cols = json_decode($_REQUEST['fields'], true);
                $temp = [];

                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);

                $alias = ['job_type' => 'Description'];

                foreach($cols AS $v){
                    $_pos = strpos($v, ".")  + 1;

                    if($_pos !== FALSE){
                        $v_col = substr($v, $_pos);
                    }

                    $v_temp = $v;
                    if(in_array($v_col, array_keys($alias))){
                        $v_temp = sprintf("%s AS %s", str_replace($v_col, $alias[$v_col], $v), $v_col);
                        $v = $v_col;
                    }

                    $sql = sprintf("SELECT %s FROM %s c 
                    INNER JOIN TabsClients tc ON c.Client = tc.ID 
                    INNER JOIN TabsRegions tr ON c.Region = tr.UID 
                    INNER JOIN PMJobs pmj ON pmj.Building = c.UID
                    INNER JOIN PMJobDescriptions pmjd ON pmj.JobType = pmjd.UID 
                    INNER JOIN PMWorkTypes pmwt ON pmjd.WorkType = pmwt.UID
                    INNER JOIN PMPriorities pmp ON pmp.UID = pmj.Priority 
                    INNER JOIN PMStatusLevels pmsl ON pmsl.UID = pmj.CurrentStatus GROUP BY %s", $v_temp, $_REQUEST['table'], $v);

                    $temp[$v_col] = select($connection, $sql, []);
                }

                echo json_encode(['data' => $temp]);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                echo $e->getMessage();
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
                $dataset_temp = null;
                foreach($cols AS $v){
                    $dataset_temp = select($connection, sprintf("SELECT c.UID, c.BuildingName, c.BuildingPicture, c.SiteNumber, tc.Client, c.Address, c.PostCode, c.Phone, c.Fax, tr.RegionName, c.SubRegion, tc.Email, c.Landlord, c.InsuranceBroker, c.EstatesManager, c.RegionalOperationsManager, c.VixenReactive, c.VixenPPM, c.LocalAuthority FROM %s  c INNER JOIN TabsClients tc ON c.Client = tc.ID INNER JOIN TabsRegions tr ON c.Region = tr.UID WHERE %s", $_REQUEST['table'], $filters), []);

                    $dataset['metadata'] = $dataset_temp;
                }

                if(!empty($dataset_temp)){
                    $con_dates = !empty($_REQUEST['date_begin']) && !empty($_REQUEST['date_end']);

                    $date_partial_sql = $con_dates?"AND pmj.DateCreated >= DATE(?) AND pmj.DateCreated <= DATE(?)":'';
                    $val_array = [$dataset_temp[0]['UID']];

                    if($con_dates)
                        $val_array = array_merge([$dataset_temp[0]['UID']], [$_REQUEST['date_begin'], $_REQUEST['date_end']]);


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
                    'UPDATE TabsBuildings SET VixenReactive = ?, VixenPPM = ? WHERE UID = ?',
                    [doubleval($_REQUEST['VixenReactive']), doubleval($_REQUEST['VixenPPM']), $_REQUEST['UID']]
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
        case 'get_asset_summary':
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

                $sql_table = select($connection, sprintf("SELECT DISTINCT(ats.AssetCode), tc.Client, tr.RegionName, c.BuildingName, c.SiteNumber, atg.GroupName, atd.Description, ats.Manufacturer, ats.Model, ats.SerialNumber, ats.Comments, ats.Quantity, ats.LocationCode, 'N/A' AS ParentCode, ats.CostCode, atl.Status, ats.CreatedBy, ats.DisposalDate
                    FROM TabsBuildings c 
                    INNER JOIN TabsClients tc ON c.Client = tc.ID 
                    INNER JOIN TabsRegions tr ON c.Region = tr.UID INNER JOIN PMJobs pmj ON c.UID = pmj.Building
                    INNER JOIN ATAssets ats ON pmj.AssetCode = ats.AssetCode INNER JOIN ATDescriptions atd ON ats.Description = atd.UID INNER JOIN ATGroups atg ON atd.GroupID = atg.UID 
                    INNER JOIN ATStatusLevels atl ON ats.StatusLevelID = atl.UID WHERE %s", $filters), []);

                $sql_tiles = select($connection, sprintf("SELECT COUNT(ats.AssetCode) AS tot_assets
                    FROM TabsBuildings c 
                    INNER JOIN TabsClients tc ON c.Client = tc.ID 
                    INNER JOIN TabsRegions tr ON c.Region = tr.UID INNER JOIN PMJobs pmj ON c.UID = pmj.Building
                    INNER JOIN ATAssets ats ON pmj.AssetCode = ats.AssetCode INNER JOIN ATDescriptions atd ON ats.Description = atd.UID INNER JOIN ATGroups atg ON atd.GroupID = atg.UID 
                    INNER JOIN ATStatusLevels atl ON ats.StatusLevelID = atl.UID WHERE %s", $filters), []);
                
                $agr_dataset = [
                    'assets' => $sql_tiles,
                    'asset_dataset' => $sql_table
                ];

                echo json_encode(['data' => $agr_dataset]);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                echo $e->getMessage();
                //return bad http request when error is encountered
                http_response_code(400);
            }     
            break;
        case 'get_atomic_asset_summary':
            try{

                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);

                $sql_tiles = select($connection, "SELECT DISTINCT(ats.AssetCode), tc.Client, c.BuildingName, atd.Description, atg.GroupName, tl.Description AS location_desc, tl.LocationCode,  ats.Manufacturer, ats.Model, ats.SerialNumber, ats.Comments, atl.Status
                    FROM TabsBuildings c 
                    INNER JOIN TabsClients tc ON c.Client = tc.ID 
                    INNER JOIN TabsRegions tr ON c.Region = tr.UID INNER JOIN PMJobs pmj ON c.UID = pmj.Building
                    INNER JOIN ATAssets ats ON pmj.AssetCode = ats.AssetCode INNER JOIN ATDescriptions atd ON ats.Description = atd.UID INNER JOIN ATGroups atg ON atd.GroupID = atg.UID 
                    INNER JOIN ATStatusLevels atl ON ats.StatusLevelID = atl.UID 
                    INNER JOIN TabsLocations tl ON ats.LocationCode = tl.LocationCode WHERE ats.AssetCode = ?", [$_REQUEST['asset_code']]);

                echo json_encode(['data' => $sql_tiles]);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                echo $e->getMessage();
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

                $dataset_bimage = select($connection, "SELECT * FROM bimage WHERE UID = ?", [intval($_REQUEST['building_image_uid'])]);

                $mv = move_uploaded_file($_FILES["file"]["tmp_name"][0], $target_file);
                if($mv){

                    if(count($dataset_bimage) > 0){
                        exec_sql(
                            $connection,
                            'UPDATE bimage SET bimage = ? WHERE UID = ?',
                            [$target_file, intval($_REQUEST['building_image_uid'])]
                        );
                    }else{
                        exec_sql(
                            $connection,
                            'INSERT INTO bimage ( UID, bimage ) VALUES (?, ?)',
                            [intval($_REQUEST['building_image_uid']),$target_file]
                        );
                    }
                }

                echo json_encode(['status' => ($mv)?'true':'false', 'location' => $target_file]);
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
                $satisfaction_survey_happy = 0;
                $satisfaction_survey_unhappy = 0;
                $satisfaction_survey_tot = 0;
                $certificates = 0;

                $date_partial_sql = "";
                $job_priorities = 0;
                $asset = 0;
                $tao = 0;

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

                    $live_job_status = select($connection, sprintf("SELECT COUNT(pmj.UID) AS number_intervention, pms.Status AS CurrentStatus FROM PMJobs pmj INNER JOIN PMStatusLevels pms ON pmj.CurrentStatus = pms.UID
                        WHERE pmj.DateCompleted IS NULL AND Building = ? %s GROUP BY pms.Status ORDER BY pms.UID ASC", $date_partial_sql), $val_array);

                    $job_priorities = select($connection, sprintf("SELECT COUNT(pmp.UID) AS number_intervention, pmp.Priority AS CurrentStatus FROM PMPriorities pmp INNER JOIN PMJobs pmj ON pmj.Priority = pmp.UID
                        WHERE pmj.DateCompleted IS NULL AND Building = ? %s GROUP BY pmp.Priority ORDER BY pmp.UID ASC", $date_partial_sql), $val_array);

                    $satisfaction_survey_tot = select($connection, sprintf('SELECT COUNT(pmjs.Happy) AS tot_review FROM PMJobSatisfactionSurveys pmjs INNER JOIN PMJobs pmj ON pmjs.JobID = pmj.UID WHERE 
                        pmj.Building = ? %s', $date_partial_sql), $val_array);

                    $satisfaction_survey_happy = select($connection, sprintf('SELECT COUNT(pmjs.Happy) AS tot_happy FROM PMJobSatisfactionSurveys pmjs INNER JOIN PMJobs pmj ON pmjs.JobID = pmj.UID WHERE 
                        pmjs.Happy = 1 AND pmj.Building = ? %s', $date_partial_sql), $val_array);

                    $satisfaction_survey_unhappy = select($connection, sprintf('SELECT COUNT(pmjs.Happy) AS tot_unhappy FROM PMJobSatisfactionSurveys pmjs INNER JOIN PMJobs pmj ON pmjs.JobID = pmj.UID WHERE 
                        pmjs.Happy = 0 AND pmj.Building = ? %s', $date_partial_sql), $val_array);

                    $asset = select($connection, sprintf('SELECT COUNT(*) AS tot_assets FROM ATAssets ats INNER JOIN PMJobs pmj ON ats.LocationCode = pmj.LocationCode WHERE pmj.Building = ? %s', $date_partial_sql), $val_array);

                    $tao = select($connection, sprintf('SELECT SUM(pmj.EstimatedCost) AS tao FROM PMJobs pmj WHERE pmj.PaymentDate IS NULL AND pmj.Building = ? %s', $date_partial_sql), $val_array);

                    $certificates = select($connection, sprintf("SELECT COUNT(pmjd.UID) AS tot_certificates FROM PMJobs pmj INNER JOIN PMJobDescriptions pmjd ON pmj.JobDescription = pmjd.UID INNER JOIN PMWorkTypes pmw ON pmjd.WorkType = pmw.UID WHERE (DATE(NOW()) > DATE_ADD(pmj.DateCreated, INTERVAL IF(DATEDIFF(DATE(pmj.EstimatedCompletionDateTime), DATE(pmj.DateCreated))<0, 0, DATEDIFF(DATE(pmj.EstimatedCompletionDateTime), DATE(pmj.DateCreated))) DAY) OR pmj.DateCompleted IS NULL) AND pmw.Name = 'CERTIFICATES' AND pmj.Building = ? %s", $date_partial_sql), $val_array);
                }

                

                $repair_jobs_stats = ["in_sla" => 0, "out_sla" => 0, "unkown"];
                foreach($repair_jobs AS $k => $v){
                    $repair_jobs_stats[$v["job_completion_status"]]++;
                }

                $maintenance_jobs_stats = ["in_sla" => 0, "out_sla" => 0];
                foreach($maintenance_jobs AS $k => $v){
                    $maintenance_jobs_stats[$v["job_completion_status"]]++;
                }

                // HOTFIX
                if(!empty($job_priorities)){
                    if($job_priorities[0]['CurrentStatus'] == "Unspecified"){
                        $shifted_el = array_shift($job_priorities);
                        $job_priorities[] = $shifted_el;
                    }
                }


                $temp_ = [
                    'repair_jobs' => $repair_jobs_stats,
                    'live_job_status' => $live_job_status,
                    'maintenance_jobs' => $maintenance_jobs_stats,
                    'jobs_today' => count($repair_jobs) + count($maintenance_jobs),
                    'job_priorities' => $job_priorities,
                    'satisfaction' => [
                        'happy' => ($satisfaction_survey_tot[0]['tot_review'] == 0)?0:(($satisfaction_survey_happy[0]['tot_happy'] / $satisfaction_survey_tot[0]['tot_review'])) * 100,
                        'unhappy' => ($satisfaction_survey_tot[0]['tot_review'] == 0)?0:(($satisfaction_survey_unhappy[0]['tot_unhappy'] / $satisfaction_survey_tot[0]['tot_review'])) * 100
                    ],
                    'asset' => $asset,
                    'total_average_order' => $tao,
                    'certificates' => $certificates
                ];

                echo json_encode(['data' => $temp_]);

                //destroy database connection
                db_disconnect($connection);
                http_response_code(200);
            }catch(Exception $e){
                echo $e->getMessage();
                //return bad http request when error is encountered 
                http_response_code(400);
            } 
            break;
        case 'building_summary':
            try{
                //creates a connection, selects the user and send the data as an JSON outstream
                $connection = db_connect(HOST, USER, PASSWORD, DB_NAME, SERVER_PORT);

                $general_info = select($connection, "SELECT tb.BuildingName, tc.Client, tb.Address, tr.RegionName, IF(tb.PostCode = '', 'N/A', tb.PostCode) AS PostCode, IF(tc.Phone = '', 'N/A', tc.Phone) AS Phone,  IF(tc.Email = '', 'N/A', tc.Email) AS Email, COALESCE(b.bimage, 'build/assets/res/img/failed_img_loader.jpg') AS building_image FROM TabsBuildings tb INNER JOIN TabsRegions tr ON tb.Region = tr.UID INNER JOIN TabsClients tc ON tb.Client = tc.ID LEFT JOIN bimage b ON tb.UID = b.UID WHERE tb.UID = ?", [$_REQUEST['building_id']]);

                $contact_section = select($connection, "SELECT tb.BuildingName, tc.Name, IF(tc.Email = '', 'N/A', tc.Email) AS Email, IF(tc.Phone = '', 'N/A', tc.Phone) AS Phone, IF(tc.Mobile = '', 'N/A', tc.Mobile) AS Mobile, tc.UID AS contact_id FROM TabsBuildings tb INNER JOIN TabsBuildingContacts tc ON tb.UID = tc.BuildingID
                    WHERE tb.UID = ?", [$_REQUEST['building_id']]);

                $floor_plans_section = select($connection, "SELECT fp.id, fp.UID, fp.fplan, COALESCE(fp.description, 'N/A') FROM fplans fp INNER JOIN TabsBuildings tb ON fp.UID = tb.UID WHERE tb.UID = ?", 
                    [$_REQUEST['building_id']]);

                $contracts_section = select($connection, "SELECT cc.ContractTitle, cc.ContractNumber, cc.ContractStartDate, cc.ContractEndDate, cc.ContractValue, cc.ContractDescription FROM COContracts cc INNER JOIN TabsBuildings tb ON tb.UID = cc.Building WHERE cc.Building = ?", 
                    [$_REQUEST['building_id']]);


                $temp = [
                    'general_info' => $general_info,
                    'contact_section' => $contact_section,
                    'floor_plans_section' => $floor_plans_section,
                    'contracts_section' => $contracts_section
                ];

                echo json_encode(['data' => $temp]);

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