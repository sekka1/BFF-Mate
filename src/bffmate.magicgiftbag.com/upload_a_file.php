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

// Include the SDK
require_once 'sdk.class.php';

// Preparation
$algorithms = new Algorithms();

// File to upload parameters
$file = 'Movie.txt';
$type = 'Rec';
$friendly_name = 'Likes Movies';
$friendly_description = 'Movies Likes';
$version = '1';

// Upload the File
$result = $algorithms->upload( $file, $type, $friendly_name, $friendly_description, $version );

echo $result;
