<?php
/*
 * Copyright 2010-2012 Algorithms.io, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 *  http://api.algorithms.io/apache2.0
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */


/**
 * CONSTANTS
 */
define('AUTH_TOKEN', '9557dbc02260f70a82c982791f693eb6');
define('URL_DOMAIN', 'http://v1.api.algorithms.io');

/**
 * INCLUDES
 */
require_once 'utilities/Curl.php';

class Algorithms
{
    private $curl;

    public function __construct(){

        $this->curl = new Curl();    
    }
    /**
    *
    * @param string $file
    * @param string $type
    * @param string $friendly_name
    * @param string $friendly_description
    * @param string $version
    * @return string/json datasource_id_seq
    */
    public function upload( $file, $type, $friendly_name, $friendly_description, $version ){

        $url = URL_DOMAIN.'/dataset';

        $post_params['theFile'] = '@'.$file;
        $http_header_vars = array(
                                'authToken: '.AUTH_TOKEN,
                                'type: '.$type,
                                'friendly_name: '.$friendly_name,
                                'friendly_description: '.$friendly_description,
                                'version: '.$version
                            );

        $outcome = $this->curl->curlPost( 'POST', $url, $http_header_vars, $post_params );

        return $outcome;
    }
    /**
    *
    * @return string json of file list
    */
    public function getFileList(){

        $url = URL_DOMAIN.'/dataset';
        $http_header_vars = array(
                                'authToken: '.AUTH_TOKEN
                            );
        $post_params = array();

        $outcome = $this->curl->curlPost( 'GET', $url, $http_header_vars, $post_params );

        return $outcome;
    }
    /*
    * @param int $datasource_id_seq
    * @param string $field_user_id
    * @param string $field_item_id
    * @param string $field_preference
    * @return string json
    */
    public function prepFileForRecommendation( $datasource_id_seq, $field_user_id, $field_item_id, $field_preference ){

        $url = URL_DOMAIN.'/jobs';

        $http_header_vars = array(
                                'authToken: '.AUTH_TOKEN
                            );
        $job['job'] = array(
                            'algorithm'=>array(
                                'id'=>13 
                            ),
                            'input_variables'=>array(
                                'datasource_id_seq'=>$datasource_id_seq,
                                'field_user_id'=>$field_user_id,
                                'field_item_id'=>$field_item_id,
                                'field_preference'=>$field_preference
                            )
                        );
        $post_params['job_params'] = json_encode( $job );

        $outcome = $this->curl->curlPost( 'POST', $url, $http_header_vars, $post_params );

        return $outcome;
    }
    /*
    * @param int $datasource_id_seq
    * @param string $type
    * @param string $item
    * @return string json
    */
    public function getRecommendation( $datasource_id_seq, $type, $item ){

        $url = URL_DOMAIN.'/jobs';

        $http_header_vars = array(
                                'authToken: '.AUTH_TOKEN
                            );
        $job['job'] = array(
                            'algorithm'=>array(
                                'id'=>14
                            ),
                            'input_variables'=>array(
                                'datasource_id_seq'=>$datasource_id_seq,
                                'type'=>$type,
                                'item'=>$item
                            )
                        );
        $post_params['job_params'] = json_encode( $job );

        $outcome = $this->curl->curlPost( 'POST', $url, $http_header_vars, $post_params );               
                                                                                                         
        return $outcome;
    }
    /*
    *
    * @param int $datasource_id_seq
    */
    public function deleteFile( $datasource_id_seq ){

        $url = URL_DOMAIN.'/dataset/id/'.$datasource_id_seq;

        $http_header_vars = array(
                                'authToken: '.AUTH_TOKEN
                            );
        $post_params = array();
        
        $outcome = $this->curl->curlPost( 'DELETE', $url, $http_header_vars, $post_params );

        return $outcome;
    }
    /*
    *
    */
    public function getCredits(){

        $url = URL_DOMAIN.'/credits';

        $http_header_vars = array(
                                'authToken: '.AUTH_TOKEN
                            );
        $post_params = array();

        $outcome = $this->curl->curlPost( 'GET', $url, $http_header_vars, $post_params );

        return $outcome;
    }
    /*
    *
    */
    public function getAlgorithms(){

        $url = URL_DOMAIN.'/algorithms';

        $http_header_vars = array(
                                'authToken: '.AUTH_TOKEN
                            );
        $post_params = array();

        $outcome = $this->curl->curlPost( 'GET', $url, $http_header_vars, $post_params );

        return $outcome;
    }
}
