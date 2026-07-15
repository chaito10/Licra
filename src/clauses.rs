use std::collections::HashMap;

use serde::{Deserialize, Serialize};
use thiserror::Error;
use uuid::Uuid;

#[derive(Debug, Error)]
pub enum ClauseError {
    #[error("clause '{clause}' requires variable '{variable}' which was not provided")]
    MissingVariable { clause: String, variable: String },

    #[error("conflicting clauses: '{a}' and '{b}'")]
    ConflictingClauses { a: String, b: String },

    #[error("clause '{clause}' depends on '{dependency}' which is not included")]
    MissingDependency { clause: String, dependency: String },

    #[error("render error: {0}")]
    RenderError(String),

    #[error("clause not found: {0}")]
    NotFound(String),
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct Clause {
    pub uuid: Uuid,
    pub name: String,
    pub description: String,
    pub version: String,
    pub category: super::license::ClauseCategory,
    pub dependencies: Vec<String>,
    pub conflicts: Vec<String>,
    pub priority: u32,
    pub template: String,
    pub variables: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CompiledSection {
    pub title: String,
    pub content: String,
    pub category: super::license::ClauseCategory,
    pub clause_uuid: Uuid,
    pub priority: u32,
}

#[derive(Debug, Clone)]
pub struct CompiledLicense {
    pub header: String,
    pub preamble: String,
    pub sections: Vec<CompiledSection>,
    pub footer: String,
}

#[derive(Debug, Clone)]
pub struct ClauseDatabase {
    clauses: Vec<Clause>,
}

const CLAUSES_JSON: &str = r#"[
  {
    "uuid":"c0000001-0000-0000-0000-000000000001",
    "name":"MIT-PERMISSION",
    "description":"MIT standard permission grant",
    "version":"1.0.0",
    "category":"permission",
    "dependencies":[],
    "conflicts":["NO-COMMERCIAL","RESTRICTED-USE"],
    "priority":100,
    "template":"Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the \"Software\"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:",
    "variables":["year","copyright_holder"]
  },
  {
    "uuid":"c0000001-0000-0000-0000-000000000002",
    "name":"MIT-CONDITION",
    "description":"MIT standard copyright notice condition",
    "version":"1.0.0",
    "category":"condition",
    "dependencies":["MIT-PERMISSION"],
    "conflicts":[],
    "priority":100,
    "template":"The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.",
    "variables":[]
  },
  {
    "uuid":"c0000001-0000-0000-0000-000000000003",
    "name":"MIT-WARRANTY",
    "description":"MIT standard warranty disclaimer",
    "version":"1.0.0",
    "category":"warranty",
    "dependencies":[],
    "conflicts":[],
    "priority":100,
    "template":"THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.",
    "variables":[]
  },
  {
    "uuid":"c0000002-0000-0000-0000-000000000001",
    "name":"APACHE-PERMISSION",
    "description":"Apache 2.0 standard permission grant",
    "version":"2.0.0",
    "category":"permission",
    "dependencies":[],
    "conflicts":["NO-COMMERCIAL"],
    "priority":100,
    "template":"Licensed under the Apache License, Version 2.0 (the \"License\"); you may not use this file except in compliance with the License. You may obtain a copy of the License at\n\n    http://www.apache.org/licenses/LICENSE-2.0\n\nUnless required by applicable law or agreed to in writing, software distributed under the License is distributed on an \"AS IS\" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.",
    "variables":[]
  },
  {
    "uuid":"c0000002-0000-0000-0000-000000000002",
    "name":"APACHE-PATENT",
    "description":"Apache 2.0 patent grant",
    "version":"2.0.0",
    "category":"patent",
    "dependencies":["APACHE-PERMISSION"],
    "conflicts":["NO-PATENT-GRANT"],
    "priority":100,
    "template":"Subject to the terms and conditions of this License, each Contributor hereby grants to You a perpetual, worldwide, non-exclusive, no-charge, royalty-free, irrevocable patent license to make, have made, use, offer to sell, sell, import, and otherwise transfer the Work, where such license applies only to those patent claims, both owned or controlled by the Contributor, that are necessarily infringed by their Contribution(s) alone or by combination of their Contribution(s) with the Work to which such Contribution(s) was submitted.",
    "variables":[]
  },
  {
    "uuid":"c0000003-0000-0000-0000-000000000001",
    "name":"GPL-COPYLEFT",
    "description":"GPL standard copyleft requirement",
    "version":"3.0.0",
    "category":"condition",
    "dependencies":[],
    "conflicts":["NO-COPYLEFT","PROPRIETARY"],
    "priority":200,
    "template":"You may convey a work based on the Program, or the modifications to produce it from the Program, in the form of source code, provided that you also meet all of these conditions:\n\na) The work must carry prominent notices stating that you modified it and giving a relevant date.\nb) The work must be licensed as a whole under this License to anyone who comes into possession of a copy.\nc) If the work has interactive user interfaces, each must display an appropriate legal notice.",
    "variables":[]
  },
  {
    "uuid":"c0000004-0000-0000-0000-000000000001",
    "name":"BSD-2-PERMISSION",
    "description":"BSD 2-Clause permission grant",
    "version":"2.0.0",
    "category":"permission",
    "dependencies":[],
    "conflicts":["NO-COMMERCIAL"],
    "priority":100,
    "template":"Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:\n\n1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.\n2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.",
    "variables":[]
  },
  {
    "uuid":"c0000004-0000-0000-0000-000000000002",
    "name":"BSD-2-DISCLAIMER",
    "description":"BSD 2-Clause disclaimer",
    "version":"2.0.0",
    "category":"warranty",
    "dependencies":[],
    "conflicts":[],
    "priority":100,
    "template":"THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS \"AS IS\" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.",
    "variables":[]
  },
  {
    "uuid":"c0000005-0000-0000-0000-000000000001",
    "name":"BSD-3-ADVERTISING",
    "description":"BSD 3-Clause advertising clause",
    "version":"3.0.0",
    "category":"condition",
    "dependencies":["BSD-2-PERMISSION"],
    "conflicts":[],
    "priority":110,
    "template":"3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.",
    "variables":[]
  },
  {
    "uuid":"c0000006-0000-0000-0000-000000000001",
    "name":"ISC-PERMISSION",
    "description":"ISC License permission grant",
    "version":"1.0.0",
    "category":"permission",
    "dependencies":[],
    "conflicts":["NO-COMMERCIAL"],
    "priority":100,
    "template":"Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.",
    "variables":[]
  },
  {
    "uuid":"c0000006-0000-0000-0000-000000000002",
    "name":"ISC-DISCLAIMER",
    "description":"ISC License disclaimer",
    "version":"1.0.0",
    "category":"warranty",
    "dependencies":[],
    "conflicts":[],
    "priority":100,
    "template":"THE SOFTWARE IS PROVIDED \"AS IS\" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.",
    "variables":[]
  },
  {
    "uuid":"c0000007-0000-0000-0000-000000000001",
    "name":"UNLICENSE",
    "description":"The Unlicense public domain dedication",
    "version":"1.0.0",
    "category":"permission",
    "dependencies":[],
    "conflicts":["COPYRIGHT-ONLY","PROPRIETARY","COMMERCIAL-EXCEPTION"],
    "priority":200,
    "template":"This is free and unencumbered software released into the public domain.\n\nAnyone is free to copy, modify, publish, use, compile, sell, or distribute this software, either in source code form or as a compiled binary, for any purpose, commercial or non-commercial, and by any means.\n\nIn jurisdictions that recognize copyright laws, the author or authors of this software dedicate any and all copyright interest in the software to the public domain. We make this dedication for the benefit of the public at large and to the detriment of our heirs and successors. We intend this dedication to be an overt act of relinquishment in perpetuity of all present and future rights to this software under copyright law.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n\nFor more information, please refer to <https://unlicense.org/>",
    "variables":[]
  },
  {
    "uuid":"c0000008-0000-0000-0000-000000000001",
    "name":"CC0-PERMISSION",
    "description":"CC0 public domain dedication",
    "version":"1.0.0",
    "category":"permission",
    "dependencies":[],
    "conflicts":["COPYRIGHT-ONLY","PROPRIETARY"],
    "priority":200,
    "template":"The person who associated a work with this deed has dedicated the work to the public domain by waiving all of his or her rights to the work worldwide under copyright law, including all related and neighboring rights, to the extent allowed by law.\n\nYou can copy, modify, distribute and perform the work, even for commercial purposes, all without asking permission.",
    "variables":[]
  },
  {
    "uuid":"c0000009-0000-0000-0000-000000000001",
    "name":"MPL-CONDITION",
    "description":"MPL 2.0 file-level copyleft",
    "version":"2.0.0",
    "category":"condition",
    "dependencies":[],
    "conflicts":["PROPRIETARY"],
    "priority":150,
    "template":"If you display Source Code, you must also display the Executable Form thereof. If the Modified Version includes Source Code, you must also include the Notice in each file of the Source Code, and include a copy of this License in the Source Code.\n\nThe Modified Software shall not include any code which is covered by this License, unless expressly included in the Source Code.",
    "variables":[]
  },
  {
    "uuid":"c0000010-0000-0000-0000-000000000001",
    "name":"LGPL-STATIC",
    "description":"LGPL static linking exception",
    "version":"3.0.0",
    "category":"condition",
    "dependencies":[],
    "conflicts":["PROPRIETARY"],
    "priority":150,
    "template":"As a special exception, the copyright holders of this library give you permission to combine this library with independent programs to produce an executable, regardless of the license terms of these independent programs, and to copy and distribute the resulting executable under terms of your choice, provided that you also meet, for each linked independent program, the terms and conditions of the license of that program.",
    "variables":[]
  },
  {
    "uuid":"c0000011-0000-0000-0000-000000000001",
    "name":"PATENT-RETALIATION",
    "description":"Patent retaliation clause",
    "version":"1.0.0",
    "category":"patent",
    "dependencies":[],
    "conflicts":[],
    "priority":50,
    "template":"If you initiate patent litigation against any entity (including a cross-claim or counterclaim in a lawsuit) alleging that the Program or a contribution incorporated within the Program constitutes direct or contributory patent infringement, then any patent licenses granted to you under this License for that Program shall terminate as of the date such litigation is filed.",
    "variables":[]
  },
  {
    "uuid":"c0000012-0000-0000-0000-000000000001",
    "name":"NO-COMMERCIAL",
    "description":"Non-commercial use restriction",
    "version":"1.0.0",
    "category":"restriction",
    "dependencies":[],
    "conflicts":["MIT-PERMISSION","BSD-2-PERMISSION","ISC-PERMISSION","APACHE-PERMISSION"],
    "priority":200,
    "template":"This software is provided solely for non-commercial purposes. Any commercial use of this software, in whole or in part, requires a separate commercial license from the copyright holder.",
    "variables":["commercial_contact"]
  },
  {
    "uuid":"c0000013-0000-0000-0000-000000000001",
    "name":"ATTRIBUTION",
    "description":"Attribution requirement clause",
    "version":"1.0.0",
    "category":"condition",
    "dependencies":[],
    "conflicts":[],
    "priority":50,
    "template":"Redistributions of source code must retain the above copyright notice, this list of conditions and the following attribution: \"{project_name}\" created by {copyright_holder}.",
    "variables":["project_name","copyright_holder"]
  },
  {
    "uuid":"c0000014-0000-0000-0000-000000000001",
    "name":"NO-TRADemark",
    "description":"Trademark use restriction",
    "version":"1.0.0",
    "category":"restriction",
    "dependencies":[],
    "conflicts":[],
    "priority":50,
    "template":"This License does not grant permission to use the trade names, trademarks, service marks, or product names of the licensor, except as required for reasonable and customary use in describing the origin of the work and reproducing the content of the notice file.",
    "variables":[]
  },
  {
    "uuid":"c0000015-0000-0000-0000-000000000001",
    "name":"SOURCE-DISCLOSURE",
    "description":"Source code disclosure requirement",
    "version":"1.0.0",
    "category":"condition",
    "dependencies":[],
    "conflicts":["PROPRIETARY"],
    "priority":100,
    "template":"If you distribute this software in executable form, you must make the complete corresponding source code available to recipients, under the same license.",
    "variables":[]
  },
  {
    "uuid":"c0000016-0000-0000-0000-000000000001",
    "name":"NETWORK-COPYLEFT",
    "description":"Network use copyleft (SaaS/AGPL-style)",
    "version":"3.0.0",
    "category":"condition",
    "dependencies":[],
    "conflicts":["PROPRIETARY","NO-COPYLEFT"],
    "priority":200,
    "template":"If you modify this program and use it over a network, you must make the complete corresponding source code available to users interacting with the modified version over the network.",
    "variables":[]
  },
  {
    "uuid":"c0000017-0000-0000-0000-000000000001",
    "name":"COPYRIGHT-NOTICE",
    "description":"Copyright notice requirement",
    "version":"1.0.0",
    "category":"condition",
    "dependencies":[],
    "conflicts":[],
    "priority":50,
    "template":"Copyright (c) {year} {copyright_holder}\n\nAll rights reserved.",
    "variables":["year","copyright_holder"]
  },
  {
    "uuid":"c0000018-0000-0000-0000-000000000001",
    "name":"DUAL-LICENSE",
    "description":"Dual licensing notice",
    "version":"1.0.0",
    "category":"meta",
    "dependencies":[],
    "conflicts":["SINGLE-LICENSE"],
    "priority":150,
    "template":"This software is dual-licensed under {license_a} and {license_b}. You may choose either license for your use.",
    "variables":["license_a","license_b"]
  },
  {
    "uuid":"c0000019-0000-0000-0000-000000000001",
    "name":"BUSL-RESTRICTION",
    "description":"Business Source License use restriction",
    "version":"1.1.0",
    "category":"restriction",
    "dependencies":[],
    "conflicts":[],
    "priority":200,
    "template":"You may not use the Software except for Non-Production Use. \"Non-Production Use\" means use of the Software for personal, internal company, research, evaluation, or educational purposes. Any production use requires a separate commercial license.",
    "variables":["change_date","change_license"]
  },
  {
    "uuid":"c0000020-0000-0000-0000-000000000001",
    "name":"SSPL-CONDITION",
    "description":"Server Side Public License condition",
    "version":"1.0.0",
    "category":"condition",
    "dependencies":[],
    "conflicts":["PROPRIETARY"],
    "priority":250,
    "template":"If you offer a hosted or managed service that uses or exposes the functionality of the Program, you must make the Complete Source Code available to every user of that service, under this License.",
    "variables":[]
  },
  {
    "uuid":"c0000021-0000-0000-0000-000000000001",
    "name":"POLYFORM-RESTRICTION",
    "description":"PolyForm Project use restriction",
    "version":"1.0.0",
    "category":"restriction",
    "dependencies":[],
    "conflicts":[],
    "priority":200,
    "template":"You may use the Software only for {allowed_uses}. Any other use requires a separate commercial license from the copyright holder.",
    "variables":["allowed_uses"]
  },
  {
    "uuid":"c0000022-0000-0000-0000-000000000001",
    "name":"AI-TRAINING-RESTRICTION",
    "description":"Restriction on AI/ML training use",
    "version":"1.0.0",
    "category":"restriction",
    "dependencies":[],
    "conflicts":[],
    "priority":100,
    "template":"You may not use this software, in whole or in part, for training, fine-tuning, or otherwise improving machine learning models, artificial intelligence systems, or similar computational systems without express written permission from the copyright holder.",
    "variables":[]
  },
  {
    "uuid":"c0000023-0000-0000-0000-000000000001",
    "name":"EXPORT-CONTROL",
    "description":"Export control compliance clause",
    "version":"1.0.0",
    "category":"compliance",
    "dependencies":[],
    "conflicts":[],
    "priority":50,
    "template":"You agree to comply with all applicable export control laws and regulations, including but not limited to the Export Administration Regulations (EAR) and sanctions programs administered by the Office of Foreign Assets Control (OFAC).",
    "variables":[]
  },
  {
    "uuid":"c0000024-0000-0000-0000-000000000001",
    "name":"TERMINATION",
    "description":"License termination on breach",
    "version":"1.0.0",
    "category":"termination",
    "dependencies":[],
    "conflicts":[],
    "priority":50,
    "template":"This License and the rights granted hereunder will terminate automatically if you fail to comply with any of its terms. Upon termination, you must cease all use of the Software and destroy all copies.",
    "variables":[]
  },
  {
    "uuid":"c0000025-0000-0000-0000-000000000001",
    "name":"REVISION",
    "description":"Revision clause allowing license updates",
    "version":"1.0.0",
    "category":"meta",
    "dependencies":[],
    "conflicts":[],
    "priority":50,
    "template":"The copyright holder reserves the right to issue new versions of this License. No one has the right to modify this License as applied to the Program.",
    "variables":[]
  },
  {
    "uuid":"c0000026-0000-0000-0000-000000000001",
    "name":"GOVERNMENT-USE",
    "description":"Government use rights",
    "version":"1.0.0",
    "category":"permission",
    "dependencies":[],
    "conflicts":[],
    "priority":50,
    "template":"U.S. Government users are granted a non-exclusive, royalty-free license with no restrictions on use, reproduction, or modification, consistent with applicable law.",
    "variables":[]
  },
  {
    "uuid":"c0000027-0000-0000-0000-000000000001",
    "name":"CONTRIBUTION-CLA",
    "description":"Contributor License Agreement clause",
    "version":"1.0.0",
    "category":"meta",
    "dependencies":[],
    "conflicts":[],
    "priority":50,
    "template":"By submitting a pull request or other contribution, you agree to the terms of the Contributor License Agreement (CLA) available at {cla_url}, and you certify that you have the right to grant the licenses in the CLA.",
    "variables":["cla_url"]
  },
  {
    "uuid":"c0000028-0000-0000-0000-000000000001",
    "name":"DRM-RESTRICTION",
    "description":"DRM/circumvention clause",
    "version":"1.0.0",
    "category":"restriction",
    "dependencies":[],
    "conflicts":[],
    "priority":50,
    "template":"You may not circumvent, disable, or otherwise interfere with security-related features of the Software, including features that prevent or restrict use or copying.",
    "variables":[]
  },
  {
    "uuid":"c0000029-0000-0000-0000-000000000001",
    "name":"SUBSCRIPTION-LICENSE",
    "description":"Subscription-based usage",
    "version":"1.0.0",
    "category":"commercial",
    "dependencies":[],
    "conflicts":[],
    "priority":100,
    "template":"This software is licensed on a subscription basis. Your license is valid for the duration of your active subscription. Upon expiration or termination, your rights to use the software cease immediately.",
    "variables":["subscription_period","pricing"]
  },
  {
    "uuid":"c0000030-0000-0000-0000-000000000001",
    "name":"EVALUATION-LICENSE",
    "description":"Evaluation/trial license",
    "version":"1.0.0",
    "category":"commercial",
    "dependencies":[],
    "conflicts":[],
    "priority":100,
    "template":"This software is provided for evaluation purposes only for a period of {evaluation_days} days from the date of acquisition. After the evaluation period, you must obtain a full license to continue use.",
    "variables":["evaluation_days"]
  },
  {
    "uuid":"c0000031-0000-0000-0000-000000000001",
    "name":"OPEN-CORE",
    "description":"Open core licensing model",
    "version":"1.0.0",
    "category":"commercial",
    "dependencies":[],
    "conflicts":[],
    "priority":100,
    "template":"The core components of this software are licensed under {core_license}. Enterprise features, as defined in the features manifest, are available under a separate commercial license.",
    "variables":["core_license","features_url"]
  },
  {
    "uuid":"c0000032-0000-0000-0000-000000000001",
    "name":"TELEMETRY-NOTICE",
    "description":"Telemetry/data collection notice",
    "version":"1.0.0",
    "category":"privacy",
    "dependencies":[],
    "conflicts":["PRIVACY-NO-TELEMETRY"],
    "priority":50,
    "template":"This software may collect usage telemetry and diagnostic data to improve product quality. You may opt out by setting telemetry_enabled=false in the configuration.",
    "variables":[]
  },
  {
    "uuid":"c0000033-0000-0000-0000-000000000001",
    "name":"HEALTHCARE-RESTRICTION",
    "description":"HIPAA/healthcare compliance restriction",
    "version":"1.0.0",
    "category":"compliance",
    "dependencies":[],
    "conflicts":[],
    "priority":50,
    "template":"This software has not been certified for use in healthcare or medical device applications. It is not compliant with HIPAA, FDA, or other healthcare regulatory requirements.",
    "variables":[]
  },
  {
    "uuid":"c0000034-0000-0000-0000-000000000001",
    "name":"NUCLEAR-RESTRICTION",
    "description":"Nuclear facility use restriction",
    "version":"1.0.0",
    "category":"compliance",
    "dependencies":[],
    "conflicts":[],
    "priority":50,
    "template":"This software is not designed, tested, or certified for use in nuclear facilities, nuclear weapons, or any application where failure could result in death, personal injury, or environmental damage.",
    "variables":[]
  },
  {
    "uuid":"c0000035-0000-0000-0000-000000000001",
    "name":"MILITARY-RESTRICTION",
    "description":"Military/defense use restriction",
    "version":"1.0.0",
    "category":"compliance",
    "dependencies":[],
    "conflicts":[],
    "priority":50,
    "template":"This software may not be used for military, defense, weapons, or intelligence applications without express written permission from the copyright holder.",
    "variables":[]
  },
  {
    "uuid":"c0000036-0000-0000-0000-000000000001",
    "name":"DERIVATIVE-WORKS-ALLOW",
    "description":"Permission to create derivative works",
    "version":"1.0.0",
    "category":"permission",
    "dependencies":[],
    "conflicts":["NO-DERIVATIVES"],
    "priority":50,
    "template":"You are permitted to create derivative works based on this software, subject to the terms and conditions of this License.",
    "variables":[]
  },
  {
    "uuid":"c0000037-0000-0000-0000-000000000001",
    "name":"NO-DERIVATIVES",
    "description":"Restriction on derivative works",
    "version":"1.0.0",
    "category":"restriction",
    "dependencies":[],
    "conflicts":["DERIVATIVE-WORKS-ALLOW","GPL-COPYLEFT","MIT-PERMISSION","BSD-2-PERMISSION","ISC-PERMISSION"],
    "priority":200,
    "template":"You may not modify, adapt, or create derivative works based on this software without express written permission from the copyright holder.",
    "variables":[]
  },
  {
    "uuid":"c0000038-0000-0000-0000-000000000001",
    "name":"PER-SEAT-LICENSE",
    "description":"Per-seat licensing model",
    "version":"1.0.0",
    "category":"commercial",
    "dependencies":[],
    "conflicts":[],
    "priority":100,
    "template":"This license grants use rights for a maximum of {max_seats} named users. Additional users require additional licenses.",
    "variables":["max_seats"]
  },
  {
    "uuid":"c0000039-0000-0000-0000-000000000001",
    "name":"PER-COMPANY-LICENSE",
    "description":"Per-company licensing model",
    "version":"1.0.0",
    "category":"commercial",
    "dependencies":[],
    "conflicts":[],
    "priority":100,
    "template":"This license is granted for use by a single company and its direct subsidiaries as defined in the license agreement. Use by separate legal entities requires a separate license.",
    "variables":["company_name"]
  },
  {
    "uuid":"c0000040-0000-0000-0000-000000000001",
    "name":"RESALE-RESTRICTION",
    "description":"Restriction on reselling",
    "version":"1.0.0",
    "category":"restriction",
    "dependencies":[],
    "conflicts":[],
    "priority":50,
    "template":"You may not resell, sublicense, or distribute this software as a standalone product or as part of a commercial offering without a separate reseller agreement.",
    "variables":[]
  },
  {
    "uuid":"c0000041-0000-0000-0000-000000000001",
    "name":"CLOUD-HOSTING",
    "description":"Cloud hosting permission",
    "version":"1.0.0",
    "category":"permission",
    "dependencies":[],
    "conflicts":[],
    "priority":50,
    "template":"You are permitted to host and run this software on cloud infrastructure, subject to the terms of this License and applicable cloud provider agreements.",
    "variables":[]
  },
  {
    "uuid":"c0000042-0000-0000-0000-000000000001",
    "name":"CONTAINER-RIGHTS",
    "description":"Containerization rights",
    "version":"1.0.0",
    "category":"permission",
    "dependencies":[],
    "conflicts":[],
    "priority":50,
    "template":"You are permitted to package, distribute, and deploy this software in containerized environments including Docker, Kubernetes, and similar orchestration platforms.",
    "variables":[]
  },
  {
    "uuid":"c0000043-0000-0000-0000-000000000001",
    "name":"OEM-LICENSE",
    "description":"OEM bundling license",
    "version":"1.0.0",
    "category":"commercial",
    "dependencies":[],
    "conflicts":[],
    "priority":100,
    "template":"Original Equipment Manufacturer (OEM) distribution rights require a separate OEM license agreement. Contact {oem_contact} for OEM licensing terms.",
    "variables":["oem_contact"]
  },
  {
    "uuid":"c0000044-0000-0000-0000-000000000001",
    "name":"WARRANTY-PROVIDED",
    "description":"Limited warranty provision",
    "version":"1.0.0",
    "category":"warranty",
    "dependencies":[],
    "conflicts":["MIT-WARRANTY","BSD-2-DISCLAIMER","ISC-DISCLAIMER"],
    "priority":200,
    "template":"The copyright holder warrants that the Software will perform substantially in accordance with its documentation for a period of {warranty_days} days from the date of delivery.",
    "variables":["warranty_days"]
  },
  {
    "uuid":"c0000045-0000-0000-0000-000000000001",
    "name":"LIABILITY-CAPPED",
    "description":"Limited liability clause",
    "version":"1.0.0",
    "category":"liability",
    "dependencies":[],
    "conflicts":[],
    "priority":50,
    "template":"In no event shall the copyright holder be liable for any indirect, incidental, special, exemplary, or consequential damages. The total liability shall not exceed the amount paid for the software.",
    "variables":[]
  },
  {
    "uuid":"c0000046-0000-0000-0000-000000000001",
    "name":"EXPIRATION",
    "description":"License expiration clause",
    "version":"1.0.0",
    "category":"termination",
    "dependencies":[],
    "conflicts":[],
    "priority":50,
    "template":"This license expires on {expiration_date}. To continue use, you must obtain a renewed license from the copyright holder.",
    "variables":["expiration_date"]
  },
  {
    "uuid":"c0000047-0000-0000-0000-000000000001",
    "name":"PRIVACY-NO-TELEMETRY",
    "description":"No telemetry privacy guarantee",
    "version":"1.0.0",
    "category":"privacy",
    "dependencies":[],
    "conflicts":["TELEMETRY-NOTICE"],
    "priority":50,
    "template":"This software does not collect, transmit, or report any usage data, telemetry, or diagnostic information. Your privacy is fully preserved.",
    "variables":[]
  },
  {
    "uuid":"c0000048-0000-0000-0000-000000000001",
    "name":"EDUCATION-EXCEPTION",
    "description":"Educational use exception",
    "version":"1.0.0",
    "category":"permission",
    "dependencies":[],
    "conflicts":[],
    "priority":50,
    "template":"Educational institutions may use this software for teaching, research, and non-commercial academic purposes without additional licensing fees.",
    "variables":[]
  },
  {
    "uuid":"c0000049-0000-0000-0000-000000000001",
    "name":"NONPROFIT-EXCEPTION",
    "description":"Non-profit organization exception",
    "version":"1.0.0",
    "category":"permission",
    "dependencies":[],
    "conflicts":[],
    "priority":50,
    "template":"Registered non-profit organizations may use this software at no cost for their non-commercial activities, provided they comply with all other terms of this License.",
    "variables":[]
  },
  {
    "uuid":"c0000050-0000-0000-0000-000000000001",
    "name":"COMMERICAL-EXCEPTION",
    "description":"Commercial use exception for otherwise restrictive licenses",
    "version":"1.0.0",
    "category":"commercial",
    "dependencies":[],
    "conflicts":[],
    "priority":50,
    "template":"Notwithstanding any other terms, commercial use is permitted provided that {commercial_conditions}.",
    "variables":["commercial_conditions"]
  }
]"#;

impl ClauseDatabase {
    pub fn new() -> Self {
        Self::new_from_json(CLAUSES_JSON)
    }

    pub fn new_from_json(json_str: &str) -> Self {
        let clauses: Vec<Clause> =
            serde_json::from_str(json_str).expect("failed to parse clause database JSON");
        ClauseDatabase { clauses }
    }

    pub fn get_clause(&self, uuid: &str) -> Option<&Clause> {
        self.clauses.iter().find(|c| c.uuid.to_string() == uuid)
    }

    pub fn get_by_name(&self, name: &str) -> Option<&Clause> {
        self.clauses.iter().find(|c| c.name == name)
    }

    pub fn search(&self, query: &str) -> Vec<&Clause> {
        let q = query.to_lowercase();
        self.clauses
            .iter()
            .filter(|c| {
                c.name.to_lowercase().contains(&q)
                    || c.description.to_lowercase().contains(&q)
                    || c.template.to_lowercase().contains(&q)
            })
            .collect()
    }

    pub fn get_by_category(&self, cat: &super::license::ClauseCategory) -> Vec<&Clause> {
        self.clauses.iter().filter(|c| c.category == *cat).collect()
    }

    pub fn validate_dependencies(&self, names: &[String]) -> Result<Vec<Clause>, ClauseError> {
        let mut resolved = Vec::new();

        for name in names {
            let clause = self
                .get_by_name(name)
                .ok_or_else(|| ClauseError::NotFound(name.clone()))?;

            resolved.push(clause.clone());

            for dep_name in &clause.dependencies {
                if !names.iter().any(|n| n == dep_name) {
                    return Err(ClauseError::MissingDependency {
                        clause: name.clone(),
                        dependency: dep_name.clone(),
                    });
                }

                if !resolved.iter().any(|c| c.name == *dep_name) {
                    let dep_clause =
                        self.get_by_name(dep_name)
                            .ok_or_else(|| ClauseError::NotFound(dep_name.clone()))?;
                    resolved.push(dep_clause.clone());
                }
            }
        }

        Ok(resolved)
    }

    pub fn check_conflicts(&self, names: &[String]) -> Result<(), ClauseError> {
        let included: Vec<&Clause> = names
            .iter()
            .filter_map(|n| self.get_by_name(n))
            .collect();

        for clause in &included {
            for conflict_name in &clause.conflicts {
                if names.iter().any(|n| n == conflict_name) {
                    return Err(ClauseError::ConflictingClauses {
                        a: clause.name.clone(),
                        b: conflict_name.clone(),
                    });
                }
            }
        }

        Ok(())
    }
}

impl Clause {
    pub fn render(&self, variables: &HashMap<String, String>) -> Result<String, ClauseError> {
        let mut output = self.template.clone();

        for var_name in &self.variables {
            match variables.get(var_name) {
                Some(value) => {
                    let placeholder = format!("{{{}}}", var_name);
                    output = output.replace(&placeholder, value);
                }
                None => {
                    return Err(ClauseError::MissingVariable {
                        clause: self.name.clone(),
                        variable: var_name.clone(),
                    });
                }
            }
        }

        Ok(output)
    }
}

impl CompiledLicense {
    pub fn from_clauses(
        clauses: &[Clause],
        variables: &HashMap<String, String>,
    ) -> Result<Self, ClauseError> {
        let mut sorted: Vec<&Clause> = clauses.iter().collect();
        sorted.sort_by_key(|c| c.priority);

        let mut preamble = String::new();
        let mut sections = Vec::new();

        for clause in sorted {
            let rendered = clause.render(variables)?;

            let section = CompiledSection {
                title: clause.name.clone(),
                content: rendered,
                category: clause.category.clone(),
                clause_uuid: clause.uuid,
                priority: clause.priority,
            };

            match clause.category {
                super::license::ClauseCategory::Permission => {
                    preamble.push_str(&section.content);
                    preamble.push_str("\n\n");
                }
                _ => {
                    sections.push(section);
                }
            }
        }

        sections.sort_by_key(|s| s.priority);

        Ok(CompiledLicense {
            header: String::new(),
            preamble: preamble.trim_end().to_string(),
            sections,
            footer: String::new(),
        })
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn test_db() -> ClauseDatabase {
        ClauseDatabase::new()
    }

    #[test]
    fn test_database_loads() {
        let db = test_db();
        assert!(!db.clauses.is_empty());
    }

    #[test]
    fn test_get_clause_by_uuid() {
        let db = test_db();
        let clause = db.get_clause("c0000001-0000-0000-0000-000000000001");
        assert!(clause.is_some());
        assert_eq!(clause.unwrap().name, "MIT-PERMISSION");
    }

    #[test]
    fn test_get_clause_not_found() {
        let db = test_db();
        assert!(db.get_clause("00000000-0000-0000-0000-000000000000").is_none());
    }

    #[test]
    fn test_get_by_name() {
        let db = test_db();
        let clause = db.get_by_name("MIT-PERMISSION");
        assert!(clause.is_some());
        assert_eq!(clause.unwrap().name, "MIT-PERMISSION");
    }

    #[test]
    fn test_get_by_name_not_found() {
        let db = test_db();
        assert!(db.get_by_name("NONEXISTENT").is_none());
    }

    #[test]
    fn test_search() {
        let db = test_db();
        let results = db.search("warranty");
        assert!(!results.is_empty());
        for clause in &results {
            let desc_lower = clause.description.to_lowercase();
            let template_lower = clause.template.to_lowercase();
            let name_lower = clause.name.to_lowercase();
            assert!(
                desc_lower.contains("warranty")
                    || template_lower.contains("warranty")
                    || name_lower.contains("warranty")
            );
        }
    }

    #[test]
    fn test_search_case_insensitive() {
        let db = test_db();
        let upper = db.search("MIT");
        let lower = db.search("mit");
        assert_eq!(upper.len(), lower.len());
    }

    #[test]
    fn test_get_by_category() {
        let db = test_db();
        let permissions = db.get_by_category(&super::super::license::ClauseCategory::Permission);
        assert!(!permissions.is_empty());
        for clause in &permissions {
            assert_eq!(clause.category, super::super::license::ClauseCategory::Permission);
        }
    }

    #[test]
    fn test_validate_dependencies_ok() {
        let db = test_db();
        let names = vec!["MIT-PERMISSION".to_string(), "MIT-CONDITION".to_string()];
        let result = db.validate_dependencies(&names);
        assert!(result.is_ok());
    }

    #[test]
    fn test_validate_dependencies_missing() {
        let db = test_db();
        let names = vec!["MIT-CONDITION".to_string()];
        let result = db.validate_dependencies(&names);
        assert!(result.is_err());
    }

    #[test]
    fn test_check_conflicts_none() {
        let db = test_db();
        let names = vec![
            "MIT-PERMISSION".to_string(),
            "MIT-CONDITION".to_string(),
        ];
        assert!(db.check_conflicts(&names).is_ok());
    }

    #[test]
    fn test_check_conflicts_found() {
        let db = test_db();
        let names = vec!["MIT-PERMISSION".to_string(), "NO-COMMERCIAL".to_string()];
        let result = db.check_conflicts(&names);
        assert!(result.is_err());
    }

    #[test]
    fn test_render_no_variables() {
        let db = test_db();
        let clause = db.get_by_name("MIT-WARRANTY").expect("MIT-WARRANTY not found");
        let vars = HashMap::new();
        let result = clause.render(&vars);
        assert!(result.is_ok());
        assert_eq!(result.unwrap(), clause.template);
    }

    #[test]
    fn test_render_with_variables() {
        let db = test_db();
        let clause = db.get_by_name("COPYRIGHT-NOTICE").expect("clause not found");
        let mut vars = HashMap::new();
        vars.insert("year".to_string(), "2026".to_string());
        vars.insert("copyright_holder".to_string(), "Test Corp".to_string());
        let result = clause.render(&vars);
        assert!(result.is_ok());
        let rendered = result.unwrap();
        assert!(rendered.contains("2026"));
        assert!(rendered.contains("Test Corp"));
    }

    #[test]
    fn test_render_missing_variable() {
        let db = test_db();
        let clause = db.get_by_name("COPYRIGHT-NOTICE").expect("clause not found");
        let vars = HashMap::new();
        let result = clause.render(&vars);
        assert!(result.is_err());
        match result {
            Err(ClauseError::MissingVariable { clause: c, variable: v }) => {
                assert_eq!(c, "COPYRIGHT-NOTICE");
                assert!(!v.is_empty());
            }
            _ => panic!("expected MissingVariable error"),
        }
    }

    #[test]
    fn test_compiled_license_from_clauses() {
        let db = test_db();
        let names = vec![
            "MIT-PERMISSION".to_string(),
            "MIT-CONDITION".to_string(),
            "MIT-WARRANTY".to_string(),
        ];
        let mut vars = HashMap::new();
        vars.insert("year".to_string(), "2026".to_string());
        vars.insert("copyright_holder".to_string(), "Author".to_string());

        let clauses: Vec<Clause> = names
            .iter()
            .filter_map(|n| db.get_by_name(n).cloned())
            .collect();

        let result = CompiledLicense::from_clauses(&clauses, &vars);
        assert!(result.is_ok());
        let compiled = result.unwrap();
        assert!(compiled.preamble.contains("Permission"));
        assert!(!compiled.sections.is_empty());
    }

    #[test]
    fn test_compiled_license_sections_sorted_by_priority() {
        let db = test_db();
        let names = vec![
            "MIT-PERMISSION".to_string(),
            "GPL-COPYLEFT".to_string(),
            "MIT-WARRANTY".to_string(),
        ];
        let mut vars = HashMap::new();
        vars.insert("year".to_string(), "2026".to_string());
        vars.insert("copyright_holder".to_string(), "Author".to_string());

        let clauses: Vec<Clause> = names
            .iter()
            .filter_map(|n| db.get_by_name(n).cloned())
            .collect();

        let compiled = CompiledLicense::from_clauses(&clauses, &vars).expect("compilation failed");
        let priorities: Vec<u32> = compiled.sections.iter().map(|s| s.priority).collect();
        let mut sorted_priorities = priorities.clone();
        sorted_priorities.sort();
        assert_eq!(priorities, sorted_priorities);
    }
}