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

class Curl
{

    public function curlPost( $http_method, $url, $http_header_array, $post_params ){
        // Does a post and optional file upload to a given url
        // INTPUT:
        /*
           $post_params['file'] = ‘@’.'/tmp/testfile.txt’;
           $post_params['submit'] = urlencode(’submit’);
         */
        $returnVal = '';

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_HTTPHEADER,$http_header_array);
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        if( $http_method == 'POST' ){
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $post_params);
        }
        if( $http_method == 'DELETE' ){
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
        }
        $result = curl_exec($ch);

        if( $result )
            $returnVal = $result;
        else
            $returnVal = curl_error($ch);

        curl_close($ch);

        return $returnVal;
    }
}
