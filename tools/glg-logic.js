/* GLG logic bundle
 * ===============
 * Name: Granular License Generator Questionnaire
 * Version: 1.0.0
 * Description: A comprehensive 300+ question questionnaire for generating precise, granular software licenses.
 *
 * Self-contained single-file port of the GLG (Granular License
 * Generator) Rust engine. Runs fully offline in-browser.
 *
 * Depends on: nothing. Declares global `GLG_DATA` and `GLGEngine`.
 */

var GLG_DATA = {"version":"1.0.0","title":"Granular License Generator Questionnaire","description":"A comprehensive 300+ question questionnaire for generating precise, granular software licenses.","questions":[{"id":"own-001","category":"Ownership","title":"Who holds the copyright for this software?","description":"Identify the primary copyright holder(s) of the software being licensed. This determines who has the legal authority to grant license rights.","tooltip":"The copyright holder is the legal owner of the intellectual property rights in the software.","help_text":"If multiple parties contributed, select the appropriate option and list all holders.","recommended_answer":{"Choice":"organization"},"legal_implications":"Incorrect copyright attribution can void the license and expose parties to infringement claims.","question_type":"Choice","options":[{"label":"Individual developer","value":"individual","description":"A single person holds the copyright"},{"label":"Organization or company","value":"organization","description":"A legal entity holds the copyright"},{"label":"Joint copyright holders","value":"joint","description":"Multiple parties share copyright ownership"},{"label":"Public domain dedication","value":"public_domain","description":"The work is placed in the public domain"}],"visible_if":null,"weight":10},{"id":"own-002","category":"Ownership","title":"Are there multiple copyright holders?","description":"If more than one person or entity contributed copyrightable code, all holders must be identified and their consent obtained.","tooltip":"Joint copyright requires agreement from all holders to modify license terms.","help_text":"List every individual or entity that contributed original code.","recommended_answer":{"Boolean":false},"legal_implications":"Failure to obtain consent from all joint holders can result in an invalid license.","question_type":"Boolean","options":[],"visible_if":null,"weight":9},{"id":"own-003","category":"Ownership","title":"Can ownership of this software be transferred?","description":"Determine whether copyright ownership can be assigned or transferred to another party in the future.","tooltip":"Ownership transfer (assignment) requires explicit written consent under most jurisdictions.","help_text":"Some open-source licenses prohibit or restrict ownership transfer.","recommended_answer":{"Boolean":true},"legal_implications":"Without explicit transfer provisions, ownership transfer may be legally ambiguous.","question_type":"Boolean","options":[],"visible_if":null,"weight":7},{"id":"own-004","category":"Ownership","title":"Are there existing ownership claims or liens on this software?","description":"Disclose any third-party claims, liens, or encumbrances that may affect the software's ownership chain.","tooltip":"Undisclosed claims can result in legal disputes after license grants.","help_text":"This includes pending litigation, inherited claims from acquired code, and contractual obligations.","recommended_answer":{"Boolean":false},"legal_implications":"Concealing existing claims may constitute misrepresentation and void the license agreement.","question_type":"Boolean","options":[],"visible_if":null,"weight":8},{"id":"own-005","category":"Ownership","title":"Is this a work made for hire?","description":"If the software was created by employees within the scope of their employment, the employer typically owns the copyright automatically.","tooltip":"Work-for-hire status affects who holds initial copyright and who can license it.","help_text":"Consult legal counsel if the employment relationship or contractor status is ambiguous.","recommended_answer":{"Boolean":false},"legal_implications":"Mischaracterizing employment status can create disputed ownership and invalidate license grants.","question_type":"Boolean","options":[],"visible_if":null,"weight":7},{"id":"copy-001","category":"Copyright","title":"Does this license explicitly address copyright?","description":"Decide whether the generated license should include an explicit copyright grant clause separate from the patent grant.","tooltip":"An explicit copyright clause clarifies what rights are being licensed under copyright law.","help_text":"Most licenses include a copyright grant to avoid ambiguity.","recommended_answer":{"Boolean":true},"legal_implications":"Without an explicit copyright clause, licensees may lack clear authorization to exercise copyright-protected rights.","question_type":"Boolean","options":[],"visible_if":null,"weight":10},{"id":"copy-002","category":"Copyright","title":"What copyright notice format should be used?","description":"Specify the format for the copyright notice that must accompany the software and derivative works.","tooltip":"A consistent copyright notice format helps maintain proper attribution chains.","help_text":"The standard format is: Copyright [year] [holder name].","recommended_answer":{"Text":"Copyright (c) {year} {holder}"},"legal_implications":"An improperly formatted notice may not satisfy statutory requirements in some jurisdictions.","question_type":"Text","options":[],"visible_if":null,"weight":8},{"id":"copy-003","category":"Copyright","title":"Must copyright registration be obtained?","description":"Determine whether users or downstream distributors are required to register the copyright in their jurisdiction.","tooltip":"Copyright registration is not required for protection in many countries but provides legal advantages in others.","help_text":"In the US, registration is required before filing an infringement lawsuit.","recommended_answer":{"Boolean":false},"legal_implications":"Requiring registration in jurisdictions where it is optional may impose unnecessary burdens on licensees.","question_type":"Boolean","options":[],"visible_if":null,"weight":5},{"id":"copy-004","category":"Copyright","title":"Can copyright be waived or dedicated to the public domain?","description":"Choose whether to allow the copyright holder to fully waive their rights, placing the software in the public domain.","tooltip":"Public domain dedication means anyone can use the software without any license conditions.","help_text":"Tools like CC0 or the Unlicense can facilitate public domain dedication.","recommended_answer":{"Choice":"license_only"},"legal_implications":"Public domain status is not recognized in all jurisdictions; a permissive license may be more effective.","question_type":"Choice","options":[{"label":"License only (retain copyright)","value":"license_only","description":"Keep copyright and grant rights via license"},{"label":"Public domain dedication","value":"public_domain","description":"Fully waive all rights"},{"label":"Both options available","value":"both","description":"Allow choice between license and public domain"}],"visible_if":null,"weight":7},{"id":"copy-005","category":"Copyright","title":"How long should the copyright protection period be?","description":"Specify the intended duration of copyright protection, although in most jurisdictions duration is determined by law.","tooltip":"Copyright duration is typically set by statute (e.g., life + 70 years in the US and EU).","help_text":"While parties cannot typically shorten statutory copyright terms, the license duration can be limited.","recommended_answer":{"Choice":"statutory"},"legal_implications":"Attempting to modify statutory copyright duration may be unenforceable in many jurisdictions.","question_type":"Choice","options":[{"label":"Statutory duration (default)","value":"statutory","description":"Follow the copyright term prescribed by law"},{"label":"License limited to specific period","value":"limited","description":"The license grants rights for a fixed term only"},{"label":"Perpetual license","value":"perpetual","description":"License rights extend for as long as copyright exists"}],"visible_if":null,"weight":6},{"id":"com-001","category":"CommercialUse","title":"Is commercial use of this software permitted?","description":"Determine whether licensees are allowed to use this software for commercial purposes, including selling products or services built with it.","tooltip":"Commercial use typically means any use intended for or resulting in commercial advantage or monetary compensation.","help_text":"Restricting commercial use may reduce adoption but can protect revenue streams.","recommended_answer":{"Choice":"permitted"},"legal_implications":"Vague commercial use restrictions can lead to disputes about what constitutes commercial use.","question_type":"Choice","options":[{"label":"Permitted without restrictions","value":"permitted","description":"Commercial use is fully allowed"},{"label":"Permitted with conditions","value":"conditional","description":"Commercial use allowed under specific terms"},{"label":"Not permitted","value":"not_permitted","description":"Commercial use is prohibited"},{"label":"Requires separate license","value":"separate_license","description":"Commercial users must obtain a commercial license"}],"visible_if":null,"weight":10},{"id":"com-002","category":"CommercialUse","title":"Does commercial use require a separate license?","description":"If commercial use is conditional, determine whether a separate commercial license must be obtained.","tooltip":"A dual-license model separates open-source and commercial terms.","help_text":"This is common in open-core business models where the core is open source but commercial features require a paid license.","recommended_answer":{"Boolean":false},"legal_implications":"Clear separation between free and commercial tiers prevents confusion and potential breach claims.","question_type":"Boolean","options":[],"visible_if":{"question_id":"com-001","operator":"Equals","value":{"Choice":"conditional"}},"weight":9},{"id":"com-003","category":"CommercialUse","title":"What revenue threshold triggers commercial license requirements?","description":"Set the annual revenue threshold above which a commercial license is required. This allows small businesses and startups to use the software freely.","tooltip":"Revenue thresholds help protect small entities while monetizing larger users.","help_text":"Common thresholds range from $50,000 to $1,000,000 in annual revenue.","recommended_answer":{"Number":100000},"legal_implications":"Thresholds must be clearly defined and consistently enforced to maintain legal validity.","question_type":"Number","options":[],"visible_if":{"question_id":"com-001","operator":"Equals","value":{"Choice":"conditional"}},"weight":8},{"id":"com-004","category":"CommercialUse","title":"What commercial use restrictions apply?","description":"Select all restrictions that apply to commercial use of this software.","tooltip":"Specific restrictions help tailor the license to your business needs.","help_text":"Select only the restrictions that are necessary for your licensing model.","recommended_answer":{"MultiChoice":["attribution_required"]},"legal_implications":"Overly broad restrictions may render the license unenforceable or deter potential users.","question_type":"MultiChoice","options":[{"label":"Attribution required","value":"attribution_required","description":"Must credit the original author in commercial products"},{"label":"Revenue sharing","value":"revenue_sharing","description":"Must share a percentage of revenue"},{"label":"Source disclosure required","value":"source_disclosure","description":"Must disclose source code for commercial products"},{"label":"Notification required","value":"notification_required","description":"Must notify the licensor of commercial use"}],"visible_if":{"question_id":"com-001","operator":"Equals","value":{"Choice":"conditional"}},"weight":8},{"id":"com-005","category":"CommercialUse","title":"Should a dual-licensing model be offered?","description":"Determine whether the software should be available under both an open-source license and a commercial license simultaneously.","tooltip":"Dual licensing allows users to choose between an open-source license (with copyleft obligations) and a commercial license (typically paid, without copyleft obligations).","help_text":"This model works best when all copyright holders agree to dual licensing.","recommended_answer":{"Boolean":false},"legal_implications":"Dual licensing requires ownership or authorization from all copyright holders to offer both license options.","question_type":"Boolean","options":[],"visible_if":{"question_id":"com-001","operator":"Equals","value":{"Choice":"permitted"}},"weight":7},{"id":"res-001","category":"Research","title":"Is use in academic or scientific research permitted?","description":"Determine whether the software may be used in research contexts, including experiments, publications, and academic projects.","tooltip":"Research use exemptions can significantly increase academic adoption.","help_text":"Many open-source licenses implicitly allow research use, but an explicit grant removes ambiguity.","recommended_answer":{"Boolean":true},"legal_implications":"Restricting research use may limit academic citation and recognition of the software.","question_type":"Boolean","options":[],"visible_if":null,"weight":7},{"id":"res-002","category":"Research","title":"Are research results built with this software required to be shared openly?","description":"Decide whether researchers using the software must publish or share their results, datasets, or findings openly.","tooltip":"Open science mandates can increase the impact of the software in the research community.","help_text":"Some funders require open-access publication; aligning the license with these requirements can be beneficial.","recommended_answer":{"Boolean":false},"legal_implications":"Mandatory sharing requirements may conflict with institutional publication policies or funding agreements.","question_type":"Boolean","options":[],"visible_if":{"question_id":"res-001","operator":"Equals","value":{"Boolean":true}},"weight":6},{"id":"res-003","category":"Research","title":"Do research institutions receive special license terms?","description":"Determine whether accredited research institutions receive different or more permissive license terms.","tooltip":"Institutional exemptions can encourage wider academic adoption.","help_text":"Define what qualifies as a research institution (e.g., accredited universities, government labs).","recommended_answer":{"Boolean":true},"legal_implications":"Unequal treatment of different user categories must be clearly defined to avoid discrimination claims.","question_type":"Boolean","options":[],"visible_if":{"question_id":"res-001","operator":"Equals","value":{"Boolean":true}},"weight":6},{"id":"res-004","category":"Research","title":"What are the publication requirements when using this software in research?","description":"Specify whether and how the software must be cited or acknowledged in research publications.","tooltip":"Publication requirements ensure the software receives proper academic credit.","help_text":"Standard citation formats include academic paper references, DOI links, or repository URLs.","recommended_answer":{"Choice":"citation_required"},"legal_implications":"Publication requirements must be reasonable and not impose undue burden on researchers.","question_type":"Choice","options":[{"label":"Citation required","value":"citation_required","description":"Must cite the software in publications"},{"label":"Acknowledgment sufficient","value":"acknowledgment","description":"A general acknowledgment is sufficient"},{"label":"No publication requirements","value":"none","description":"No specific publication obligations"}],"visible_if":{"question_id":"res-001","operator":"Equals","value":{"Boolean":true}},"weight":5},{"id":"acad-001","category":"Academic","title":"Is use in academic coursework and teaching permitted?","description":"Determine whether the software can be used in educational settings such as classrooms, homework assignments, and academic exercises.","tooltip":"Academic use exemptions help integrate software into curricula.","help_text":"This is distinct from research use; academic use focuses on teaching and learning.","recommended_answer":{"Boolean":true},"legal_implications":"Restricting educational use may limit the software's pedagogical value and institutional adoption.","question_type":"Boolean","options":[],"visible_if":null,"weight":6},{"id":"acad-002","category":"Academic","title":"What academic license terms should apply?","description":"Choose the licensing model for academic institutions using this software.","tooltip":"Academic licenses often offer reduced fees or more permissive terms.","help_text":"Consider whether students, faculty, and staff should have different access levels.","recommended_answer":{"Choice":"free_with_attribution"},"legal_implications":"Clearly defined academic terms prevent unauthorized commercial use under the guise of education.","question_type":"Choice","options":[{"label":"Free with attribution","value":"free_with_attribution","description":"Free use if properly attributed"},{"label":"Discounted license","value":"discounted","description":"Reduced fee academic license"},{"label":"Full license applies","value":"full","description":"No special academic terms"},{"label":"Free for all academic use","value":"free","description":"Completely free for all academic purposes"}],"visible_if":{"question_id":"acad-001","operator":"Equals","value":{"Boolean":true}},"weight":5},{"id":"acad-003","category":"Academic","title":"Can students use this software in personal projects?","description":"Determine whether students enrolled at academic institutions can use the software for personal, non-course-related projects.","tooltip":"Student personal use extends the software's reach beyond the classroom.","help_text":"Consider whether the student's project might later become commercial.","recommended_answer":{"Boolean":true},"legal_implications":"Personal project use by students may blur the line between academic and commercial use over time.","question_type":"Boolean","options":[],"visible_if":{"question_id":"acad-001","operator":"Equals","value":{"Boolean":true}},"weight":4},{"id":"acad-004","category":"Academic","title":"Are academic institutions required to include the license in course materials?","description":"Specify whether instructors must include the license text or terms when using the software in their courses.","tooltip":"License inclusion in course materials ensures students understand their obligations.","help_text":"This is especially important for courses that involve distributing modified versions of the software.","recommended_answer":{"Boolean":true},"legal_implications":"Failure to inform students of license terms may complicate enforcement downstream.","question_type":"Boolean","options":[],"visible_if":{"question_id":"acad-001","operator":"Equals","value":{"Boolean":true}},"weight":3},{"id":"pat-001","category":"PatentGrant","title":"Does this license include an express patent grant?","description":"Decide whether the license should include an explicit grant of patent rights from the licensor to the licensee.","tooltip":"An express patent grant protects licensees from patent infringement claims by the licensor.","help_text":"Patent grants are common in major open-source licenses like Apache 2.0 and GPLv3.","recommended_answer":{"Boolean":true},"legal_implications":"Without an express patent grant, licensees may be vulnerable to patent claims even if they comply with copyright terms.","question_type":"Boolean","options":[],"visible_if":null,"weight":9},{"id":"pat-002","category":"PatentGrant","title":"What is the scope of the patent grant?","description":"Define how broadly the patent rights are granted under this license.","tooltip":"The scope determines which patent-related activities are covered by the grant.","help_text":"Broader scope provides more protection to licensees but may expose the licensor to more risk.","recommended_answer":{"Choice":"worldwide"},"legal_implications":"Narrowly scoped patent grants may leave licensees exposed in certain jurisdictions or use cases.","question_type":"Choice","options":[{"label":"Worldwide, perpetual","value":"worldwide","description":"Full global patent rights for the life of the patents"},{"label":"Territory-limited","value":"territory","description":"Patent rights limited to specific countries or regions"},{"label":"Use-case limited","value":"use_case","description":"Patent rights limited to specific types of use"},{"label":"No patent grant","value":"none","description":"No patent rights are granted"}],"visible_if":{"question_id":"pat-001","operator":"Equals","value":{"Boolean":true}},"weight":8},{"id":"pat-003","category":"PatentGrant","title":"What conditions attach to the patent grant?","description":"Select the conditions that must be met for the patent grant to remain in effect.","tooltip":"Conditions on the patent grant help protect the licensor from patent aggression.","help_text":"Common conditions include compliance with license terms and no patent litigation against the licensor.","recommended_answer":{"MultiChoice":["license_compliance"]},"legal_implications":"Conditions that are too onerous may undermine the patent grant's value to licensees.","question_type":"MultiChoice","options":[{"label":"License compliance required","value":"license_compliance","description":"Grant only valid if licensee follows license terms"},{"label":"No litigation against licensor","value":"no_litigation","description":"Grant revoked if licensee sues licensor for patents"},{"label":"Improvement disclosure","value":"improvement_disclosure","description":"Must disclose improvements to patented technology"},{"label":"No conditions","value":"unconditional","description":"The patent grant has no conditions"}],"visible_if":{"question_id":"pat-001","operator":"Equals","value":{"Boolean":true}},"weight":7},{"id":"pat-004","category":"PatentGrant","title":"Does the license include a patent retaliation clause?","description":"Determine whether patent rights are automatically revoked if the licensee initiates patent litigation against the licensor.","tooltip":"Patent retaliation clauses deter patent aggression against the licensor and other licensees.","help_text":"This is a standard feature in many modern open-source licenses.","recommended_answer":{"Boolean":true},"legal_implications":"Retaliation clauses must be carefully drafted to avoid being considered unconscionable in some jurisdictions.","question_type":"Boolean","options":[],"visible_if":{"question_id":"pat-001","operator":"Equals","value":{"Boolean":true}},"weight":7},{"id":"ptr-001","category":"PatentRetaliation","title":"Should the patent retaliation clause be included?","description":"Decide whether to include a clause that terminates patent grants if the licensee sues the licensor for patent infringement.","tooltip":"Patent retaliation is a defensive mechanism to protect the licensor and community.","help_text":"This clause is recommended for projects that want to prevent patent trolling.","recommended_answer":{"Boolean":true},"legal_implications":"The enforceability of retaliation clauses varies by jurisdiction and must be clearly drafted.","question_type":"Boolean","options":[],"visible_if":null,"weight":7},{"id":"ptr-002","category":"PatentRetaliation","title":"What triggers the patent retaliation clause?","description":"Define the specific actions that would trigger patent rights termination.","tooltip":"Clear trigger conditions prevent disputes about when retaliation applies.","help_text":"Consider whether indirect litigation (e.g., through subsidiaries) should also trigger the clause.","recommended_answer":{"MultiChoice":["direct_litigation"]},"legal_implications":"Overly broad triggers may discourage legitimate patent enforcement by licensees.","question_type":"MultiChoice","options":[{"label":"Direct patent litigation","value":"direct_litigation","description":"Filing a patent lawsuit directly against the licensor"},{"label":"Indirect litigation","value":"indirect_litigation","description":"Using subsidiaries or affiliates to litigate"},{"label":"Patent assertion claims","value":"patent_assertion","description":"Any assertion of patent rights against the licensor"},{"label":"Contributory infringement","value":"contributory","description":"Contributing to patent infringement claims against the licensor"}],"visible_if":{"question_id":"ptr-001","operator":"Equals","value":{"Boolean":true}},"weight":6},{"id":"ptr-003","category":"PatentRetaliation","title":"What is the scope of the patent retaliation?","description":"Determine how broadly the retaliation provisions apply when triggered.","tooltip":"The scope determines what rights are lost when retaliation is triggered.","help_text":"Consider whether to revoke all license rights or only patent-specific rights.","recommended_answer":{"Choice":"patent_only"},"legal_implications":"Revoking more rights than necessary may be seen as disproportionate and reduce enforceability.","question_type":"Choice","options":[{"label":"Patent grant only","value":"patent_only","description":"Only patent rights are revoked; copyright license continues"},{"label":"All license rights","value":"all_rights","description":"The entire license is terminated including copyright"},{"label":"Tiered revocation","value":"tiered","description":"Graduated response depending on severity"}],"visible_if":{"question_id":"ptr-001","operator":"Equals","value":{"Boolean":true}},"weight":6},{"id":"ptr-004","category":"PatentRetaliation","title":"Is there a defensive termination provision?","description":"Include a provision that prevents the licensor from initiating patent claims against users who comply with the license.","tooltip":"Defensive termination ensures the licensor does not use patents offensively against compliant users.","help_text":"This is sometimes called a 'patent peace' clause.","recommended_answer":{"Boolean":true},"legal_implications":"A mutual defensive provision creates a balanced patent relationship between licensor and licensee.","question_type":"Boolean","options":[],"visible_if":{"question_id":"ptr-001","operator":"Equals","value":{"Boolean":true}},"weight":5},{"id":"tm-001","category":"Trademark","title":"Can the software name and trademarks be used by licensees?","description":"Determine whether licensees are permitted to use the software's name, logos, and other trademarks.","tooltip":"Trademark rights are separate from copyright and are not automatically licensed.","help_text":"Most open-source licenses explicitly exclude trademark rights from the license grant.","recommended_answer":{"Boolean":false},"legal_implications":"Uncontrolled trademark use can lead to brand confusion and loss of trademark protections.","question_type":"Boolean","options":[],"visible_if":null,"weight":7},{"id":"tm-002","category":"Trademark","title":"What trademark usage restrictions apply?","description":"Select the restrictions on how the software's trademarks may be used by licensees and third parties.","tooltip":"Trademark restrictions protect the brand identity of the software project.","help_text":"Consider both the software name and any associated logos or branding elements.","recommended_answer":{"MultiChoice":["no_modification","attribution_only"]},"legal_implications":"Trademark misuse can result in 'genericide' and loss of trademark protection.","question_type":"MultiChoice","options":[{"label":"No modification of marks","value":"no_modification","description":"Trademarks must be used exactly as provided"},{"label":"Attribution only","value":"attribution_only","description":"Trademarks can be used only for attribution"},{"label":"No use of trademarks","value":"no_use","description":"Trademarks may not be used at all"},{"label":"Approved use only","value":"approved","description":"Use requires prior written approval"}],"visible_if":{"question_id":"tm-001","operator":"Equals","value":{"Boolean":true}},"weight":6},{"id":"tm-003","category":"Trademark","title":"Are trademarks licensed separately from the copyright?","description":"Clarify whether trademark rights are handled in a separate agreement from the copyright license.","tooltip":"Separate trademark licensing gives the licensor more control over brand usage.","help_text":"This is the standard approach in most major open-source projects.","recommended_answer":{"Boolean":true},"legal_implications":"Mixing trademark and copyright terms can create confusion about what rights are actually granted.","question_type":"Boolean","options":[],"visible_if":null,"weight":6},{"id":"tm-004","category":"Trademark","title":"What are the trademark attribution requirements?","description":"Specify how trademark attribution should be presented when the trademarks are used with permission.","tooltip":"Proper trademark attribution helps maintain the distinctiveness of the marks.","help_text":"Trademark attribution typically uses the TM or R symbol and a statement of ownership.","recommended_answer":{"Text":"Use of {trademark} is subject to approval. {holder} is the owner of the {trademark} trademark."},"legal_implications":"Incorrect trademark attribution (e.g., using R for unregistered marks) can constitute false advertising.","question_type":"Text","options":[],"visible_if":{"question_id":"tm-001","operator":"Equals","value":{"Boolean":true}},"weight":4},{"id":"src-001","category":"SourceDisclosure","title":"Must source code be disclosed when distributing the software?","description":"Determine whether licensees must make the source code available when they distribute the software or derivative works.","tooltip":"Source disclosure requirements are a hallmark of copyleft licenses.","help_text":"Permissive licenses typically do not require source disclosure; copyleft licenses always do.","recommended_answer":{"Choice":"no"},"legal_implications":"Failure to comply with source disclosure requirements is a material breach of copyleft licenses.","question_type":"Choice","options":[{"label":"No disclosure required","value":"no","description":"Binary distribution is sufficient"},{"label":"Disclosure on request","value":"on_request","description":"Source must be provided when users request it"},{"label":"Disclosure required with distribution","value":"mandatory","description":"Source must accompany every distribution"},{"label":"Disclosure for derivative works only","value":"derivatives","description":"Only modified versions require source disclosure"}],"visible_if":null,"weight":9},{"id":"src-002","category":"SourceDisclosure","title":"What triggers source code disclosure obligations?","description":"Define the specific scenarios that trigger source code disclosure requirements.","tooltip":"Different triggers create different levels of disclosure obligation.","help_text":"Consider whether internal distribution, SaaS hosting, or other activities should trigger disclosure.","recommended_answer":{"MultiChoice":["binary_distribution"]},"legal_implications":"Unclear triggers can lead to inadvertent non-compliance with source disclosure terms.","question_type":"MultiChoice","options":[{"label":"Binary distribution","value":"binary_distribution","description":"Distributing compiled binaries"},{"label":"SaaS deployment","value":"saas_deployment","description":"Making the software available as a service"},{"label":"Internal use by large organizations","value":"internal_large","description":"Use within large organizations with many employees"},{"label":"Commercial use","value":"commercial","description":"Any use for commercial purposes"}],"visible_if":{"question_id":"src-001","operator":"NotEquals","value":{"Choice":"no"}},"weight":8},{"id":"src-003","category":"SourceDisclosure","title":"What is the timeline for source code disclosure?","description":"Specify the time frame within which source code must be made available after a triggering event.","tooltip":"A reasonable disclosure timeline balances licensor protection with licensee flexibility.","help_text":"30 to 90 days are common disclosure timelines in copyleft licenses.","recommended_answer":{"Choice":"30_days"},"legal_implications":"Unreasonably short timelines may be unenforceable; overly long timelines reduce protection.","question_type":"Choice","options":[{"label":"Immediately","value":"immediate","description":"Source must be available at the time of distribution"},{"label":"Within 30 days","value":"30_days","description":"Source must be disclosed within 30 days"},{"label":"Within 90 days","value":"90_days","description":"Source must be disclosed within 90 days"},{"label":"Within one year","value":"1_year","description":"Source must be disclosed within one year"}],"visible_if":{"question_id":"src-001","operator":"NotEquals","value":{"Choice":"no"}},"weight":7},{"id":"src-004","category":"SourceDisclosure","title":"Where must disclosed source code be hosted?","description":"Specify the requirements for where source code must be made available when disclosure is required.","tooltip":"Accessible hosting ensures that source code remains available to the community.","help_text":"Consider whether a public repository, company website, or any URL is acceptable.","recommended_answer":{"Choice":"public_repo"},"legal_implications":"Source hosted at an inaccessible location may not satisfy disclosure requirements.","question_type":"Choice","options":[{"label":"Public repository","value":"public_repo","description":"Must be available on a public code hosting platform"},{"label":"Company website","value":"company_site","description":"Can be hosted on the distributor's website"},{"label":"Any accessible URL","value":"any_url","description":"Any URL that is publicly accessible"},{"label":"Physical media on request","value":"physical","description":"Source available on physical media for cost of distribution"}],"visible_if":{"question_id":"src-001","operator":"NotEquals","value":{"Choice":"no"}},"weight":6},{"id":"slink-001","category":"StaticLinking","title":"Is static linking to this software permitted?","description":"Determine whether other software can be statically linked (compiled together) with this software.","tooltip":"Static linking creates a single executable and raises questions about derivative works.","help_text":"GPL-family licenses consider static linking as creating a derivative work; permissive licenses do not.","recommended_answer":{"Boolean":true},"legal_implications":"If static linking creates a derivative work, the combined work may need to be licensed under the same terms.","question_type":"Boolean","options":[],"visible_if":null,"weight":8},{"id":"slink-002","category":"StaticLinking","title":"Does static linking create a derivative work?","description":"Define whether statically linking with this software creates a derivative work that must be licensed under the same terms.","tooltip":"This is one of the most debated questions in open-source licensing.","help_text":"The FSF considers static linking as creating a derivative work; others disagree. Be explicit.","recommended_answer":{"Boolean":false},"legal_implications":"Ambiguity on this point leads to widespread non-compliance and legal uncertainty in the ecosystem.","question_type":"Boolean","options":[],"visible_if":{"question_id":"slink-001","operator":"Equals","value":{"Boolean":true}},"weight":9},{"id":"slink-003","category":"StaticLinking","title":"What license propagation requirements apply for static linking?","description":"Specify what licensing obligations apply to the combined work when static linking occurs.","tooltip":"License propagation terms determine how license obligations flow to statically linked code.","help_text":"Consider whether to require the same license, a compatible license, or no propagation at all.","recommended_answer":{"Choice":"no_propagation"},"legal_implications":"Incompatible license propagation requirements can prevent static linking with proprietary software entirely.","question_type":"Choice","options":[{"label":"No license propagation","value":"no_propagation","description":"Linked code retains its own license"},{"label":"Same license required","value":"same_license","description":"The entire work must be under this license"},{"label":"Compatible license required","value":"compatible","description":"The linked code must use a compatible license"},{"label":"LGPL-style linking exception","value":"lgpl_exception","description":"Linked work can use any license if the library remains under this license"}],"visible_if":{"question_id":"slink-001","operator":"Equals","value":{"Boolean":true}},"weight":8},{"id":"slink-004","category":"StaticLinking","title":"Is object code disclosure required for statically linked works?","description":"Determine whether licensees must provide the intermediate object code when static linking triggers source disclosure.","tooltip":"Object code disclosure is sometimes required as an alternative to full source code disclosure.","help_text":"This is common in LGPL licenses where the library source must be available but the application does not.","recommended_answer":{"Boolean":false},"legal_implications":"Object code requirements can be a reasonable compromise between source disclosure and proprietary use.","question_type":"Boolean","options":[],"visible_if":{"question_id":"slink-001","operator":"Equals","value":{"Boolean":true}},"weight":6},{"id":"dlink-001","category":"DynamicLinking","title":"Is dynamic linking to this software permitted?","description":"Determine whether other software can dynamically link (load at runtime) with this software.","tooltip":"Dynamic linking keeps the two programs separate at runtime through shared libraries.","help_text":"Most licenses allow dynamic linking; the key question is whether it creates a derivative work.","recommended_answer":{"Boolean":true},"legal_implications":"Restricting dynamic linking can severely limit the software's usability as a library.","question_type":"Boolean","options":[],"visible_if":null,"weight":8},{"id":"dlink-002","category":"DynamicLinking","title":"Does dynamic linking create a derivative work?","description":"Define whether dynamically linking with this software creates a derivative work that must inherit the license.","tooltip":"The derivative work question is generally considered less controversial for dynamic linking than static.","help_text":"Most legal scholars consider dynamic linking less likely to create a derivative work than static linking.","recommended_answer":{"Boolean":false},"legal_implications":"Explicitly addressing this question eliminates legal ambiguity for downstream developers.","question_type":"Boolean","options":[],"visible_if":{"question_id":"dlink-001","operator":"Equals","value":{"Boolean":true}},"weight":7},{"id":"dlink-003","category":"DynamicLinking","title":"What license obligations apply to dynamically linked code?","description":"Specify the license terms that apply to code that dynamically links with this software.","tooltip":"License obligations for dynamic linking are typically lighter than for static linking.","help_text":"Consider whether the linking application must use the same license or can use any license.","recommended_answer":{"Choice":"no_propagation"},"legal_implications":"License propagation through dynamic linking is a contentious issue that should be explicitly addressed.","question_type":"Choice","options":[{"label":"No license propagation","value":"no_propagation","description":"The application retains its own license"},{"label":"Same license required","value":"same_license","description":"The application must use this license"},{"label":"Notice and attribution","value":"notice","description":"Must include license notice and attribution"}],"visible_if":{"question_id":"dlink-001","operator":"Equals","value":{"Boolean":true}},"weight":7},{"id":"dlink-004","category":"DynamicLinking","title":"Is API/interface stability guaranteed for dynamic linking?","description":"Determine whether the licensor commits to maintaining a stable API for dynamic linking compatibility.","tooltip":"API stability guarantees help downstream developers who depend on dynamic linking.","help_text":"API stability is important for library-type software where others depend on the interface.","recommended_answer":{"Boolean":false},"legal_implications":"Promising API stability without delivering it could lead to claims of misrepresentation.","question_type":"Boolean","options":[],"visible_if":{"question_id":"dlink-001","operator":"Equals","value":{"Boolean":true}},"weight":5},{"id":"net-001","category":"NetworkUse","title":"Does providing the software over a network constitute distribution?","description":"Decide whether making the software available over a network (e.g., SaaS, cloud services) counts as distribution that triggers license obligations.","tooltip":"This is the 'SaaS loophole' question that AGPL was created to address.","help_text":"GPL/AGPL differ on this point: AGPL closes the SaaS loophole; GPL does not.","recommended_answer":{"Boolean":false},"legal_implications":"The answer to this question fundamentally changes the license's behavior in cloud environments.","question_type":"Boolean","options":[],"visible_if":null,"weight":9},{"id":"net-002","category":"NetworkUse","title":"What network use restrictions apply?","description":"Select the restrictions that apply when the software is accessed or used over a network.","tooltip":"Network restrictions can prevent competitors from offering the software as a service without contributing back.","help_text":"Consider both commercial and non-commercial network use scenarios.","recommended_answer":{"MultiChoice":["attribution_required"]},"legal_implications":"Network use restrictions must be clearly defined to be enforceable.","question_type":"MultiChoice","options":[{"label":"Attribution required","value":"attribution_required","description":"Must display attribution to users over the network"},{"label":"Source disclosure required","value":"source_disclosure","description":"Must provide source code to network users"},{"label":"Notification to licensor","value":"notification","description":"Must notify the licensor of network deployment"},{"label":"No network restrictions","value":"none","description":"Network use is unrestricted"}],"visible_if":null,"weight":7},{"id":"net-003","category":"NetworkUse","title":"How are API interactions classified?","description":"Determine whether API calls to a service using this software constitute use, distribution, or network access under the license.","tooltip":"API interaction classification affects whether API consumers have license obligations.","help_text":"This is important for microservices architectures where components communicate via APIs.","recommended_answer":{"Choice":"not_distribution"},"legal_implications":"Misclassifying API interactions can create unexpected license obligations for API consumers.","question_type":"Choice","options":[{"label":"Not distribution or use","value":"not_distribution","description":"API calls do not trigger license obligations"},{"label":"Constitutes use","value":"use","description":"API callers are considered users of the software"},{"label":"Constitutes distribution","value":"distribution","description":"API interactions are treated as distribution"}],"visible_if":null,"weight":6},{"id":"net-004","category":"NetworkUse","title":"Is network interaction logging required?","description":"Specify whether the licensor must be notified of or provided with logs of network interactions with the software.","tooltip":"Logging requirements can provide usage data but raise privacy concerns.","help_text":"Logging is more common in enterprise licenses than in open-source licenses.","recommended_answer":{"Boolean":false},"legal_implications":"Mandatory logging requirements may conflict with data protection regulations like GDPR.","question_type":"Boolean","options":[],"visible_if":null,"weight":4},{"id":"dist-001","category":"Distribution","title":"Is binary distribution of the software permitted?","description":"Determine whether licensees can distribute compiled binaries of the software to third parties.","tooltip":"Binary distribution allows the software to reach users who cannot compile from source.","help_text":"Most licenses allow binary distribution, but some restrictions may apply.","recommended_answer":{"Boolean":true},"legal_implications":"Restricting binary distribution limits the software's accessibility and adoption.","question_type":"Boolean","options":[],"visible_if":null,"weight":9},{"id":"dist-002","category":"Distribution","title":"What conditions apply to distribution?","description":"Select the conditions that must be met when distributing the software or derivative works.","tooltip":"Distribution conditions define what obligations accompany redistribution.","help_text":"Common conditions include license inclusion, source availability, and attribution.","recommended_answer":{"MultiChoice":["license_included","attribution"]},"legal_implications":"Clear distribution conditions prevent downstream non-compliance and license violations.","question_type":"MultiChoice","options":[{"label":"License text must be included","value":"license_included","description":"A copy of the license must accompany the distribution"},{"label":"Attribution required","value":"attribution","description":"Must credit the original author(s)"},{"label":"Source code must be available","value":"source_available","description":"Source code must be provided with or alongside the binary"},{"label":"No conditions","value":"none","description":"Distribution is unrestricted"}],"visible_if":{"question_id":"dist-001","operator":"Equals","value":{"Boolean":true}},"weight":8},{"id":"dist-003","category":"Distribution","title":"Must the license be included in all distributions?","description":"Determine whether a copy of the license text must accompany every distribution of the software.","tooltip":"License inclusion ensures that all recipients are aware of their rights and obligations.","help_text":"This is a standard requirement in virtually all open-source licenses.","recommended_answer":{"Boolean":true},"legal_implications":"Omitting the license text from distributions can void the license grant for recipients.","question_type":"Boolean","options":[],"visible_if":{"question_id":"dist-001","operator":"Equals","value":{"Boolean":true}},"weight":7},{"id":"dist-004","category":"Distribution","title":"Are there restrictions on distribution media?","description":"Specify whether the distribution medium (electronic, physical, etc.) is restricted.","tooltip":"Medium restrictions can affect how the software reaches end users.","help_text":"Most modern licenses do not restrict distribution medium.","recommended_answer":{"MultiChoice":["any_medium"]},"legal_implications":"Medium restrictions may be difficult to enforce in the digital age.","question_type":"MultiChoice","options":[{"label":"Any medium permitted","value":"any_medium","description":"Electronic and physical distribution allowed"},{"label":"Electronic only","value":"electronic","description":"Distribution limited to electronic means"},{"label":"Physical media only","value":"physical","description":"Distribution limited to physical media like USB, CD, DVD"}],"visible_if":{"question_id":"dist-001","operator":"Equals","value":{"Boolean":true}},"weight":4},{"id":"mod-001","category":"Modification","title":"Is modification of the software allowed?","description":"Determine whether licensees can modify the source code and create derivative works.","tooltip":"Modification rights are fundamental to the open-source model.","help_text":"Restricting modification makes the software effectively closed-source regardless of source availability.","recommended_answer":{"Boolean":true},"legal_implications":"Restricting modification is incompatible with the Open Source Definition and OSI approval.","question_type":"Boolean","options":[],"visible_if":null,"weight":10},{"id":"mod-002","category":"Modification","title":"Must modifications to the software be disclosed?","description":"Decide whether modifications must be shared back with the community or made publicly available.","tooltip":"Mandatory disclosure of modifications is a core copyleft principle.","help_text":"Permissive licenses do not require disclosure; copyleft licenses do.","recommended_answer":{"Boolean":false},"legal_implications":"Mandatory disclosure requirements significantly limit how organizations can use the software internally.","question_type":"Boolean","options":[],"visible_if":{"question_id":"mod-001","operator":"Equals","value":{"Boolean":true}},"weight":8},{"id":"mod-003","category":"Modification","title":"What naming requirements apply to modified versions?","description":"Specify whether modified versions must use a different name to avoid confusion with the original.","tooltip":"Naming requirements prevent confusion between the original and modified versions.","help_text":"This protects the original project's reputation if the modified version has issues.","recommended_answer":{"Choice":"different_name"},"legal_implications":"Failure to rename modified versions can lead to trademark infringement claims.","question_type":"Choice","options":[{"label":"Must use different name","value":"different_name","description":"Modified versions must have a distinct name"},{"label":"Must indicate modification","value":"indicate","description":"Must clearly indicate the version is modified"},{"label":"No naming restrictions","value":"none","description":"Modified versions can use the original name"}],"visible_if":{"question_id":"mod-001","operator":"Equals","value":{"Boolean":true}},"weight":6},{"id":"mod-004","category":"Modification","title":"Are modifications subject to review or approval?","description":"Determine whether modifications must be reviewed and approved before they can be distributed or used publicly.","tooltip":"Review requirements can help maintain code quality but slow down the contribution process.","help_text":"Upstream review is common in large projects with strict quality standards.","recommended_answer":{"Boolean":false},"legal_implications":"Mandatory review processes can limit the freedom of downstream users to modify and distribute.","question_type":"Boolean","options":[],"visible_if":{"question_id":"mod-001","operator":"Equals","value":{"Boolean":true}},"weight":5},{"id":"priv-001","category":"PrivateUse","title":"Is private use of the software permitted without restrictions?","description":"Determine whether individuals and organizations can use the software privately without any license obligations.","tooltip":"Private use exemptions allow free use for personal and internal purposes.","help_text":"Most licenses implicitly allow private use; making it explicit removes ambiguity.","recommended_answer":{"Boolean":true},"legal_implications":"Restricting private use is unusual and may deter individual developers and small teams.","question_type":"Boolean","options":[],"visible_if":null,"weight":7},{"id":"priv-002","category":"PrivateUse","title":"Does private use include internal business use?","description":"Clarify whether internal use within a company or organization qualifies as private use.","tooltip":"The boundary between private and commercial use can be blurry in organizational contexts.","help_text":"Some licenses treat internal business use as commercial; others do not.","recommended_answer":{"Boolean":true},"legal_implications":"Ambiguity here is a common source of license compliance issues in enterprise environments.","question_type":"Boolean","options":[],"visible_if":{"question_id":"priv-001","operator":"Equals","value":{"Boolean":true}},"weight":7},{"id":"priv-003","category":"PrivateUse","title":"Are there sharing limitations on private use?","description":"Determine whether the software can be shared among employees or team members under private use.","tooltip":"Internal sharing restrictions affect how teams can collaborate using the software.","help_text":"Consider whether sharing is limited by organization size or type.","recommended_answer":{"Choice":"unlimited_sharing"},"legal_implications":"Restricting internal sharing can create compliance headaches in large organizations.","question_type":"Choice","options":[{"label":"Unlimited internal sharing","value":"unlimited_sharing","description":"Can share freely within an organization"},{"label":"Limited by user count","value":"user_limited","description":"Sharing limited to a specified number of users"},{"label":"No sharing permitted","value":"no_sharing","description":"Each user must obtain their own license"}],"visible_if":{"question_id":"priv-001","operator":"Equals","value":{"Boolean":true}},"weight":5},{"id":"priv-004","category":"PrivateUse","title":"What are the private modification requirements?","description":"Specify whether modifications made for private use must comply with any particular requirements.","tooltip":"Private modification rights determine how freely users can adapt the software for their own needs.","help_text":"Some copyleft licenses do not require disclosure of modifications used only privately.","recommended_answer":{"Choice":"no_requirements"},"legal_implications":"Restricting private modifications limits the software's adaptability for specific use cases.","question_type":"Choice","options":[{"label":"No requirements","value":"no_requirements","description":"Free to modify without any obligations"},{"label":"Must retain license","value":"retain_license","description":"Must keep the original license in modified files"},{"label":"Must retain attribution","value":"retain_attribution","description":"Must keep original author attribution"}],"visible_if":{"question_id":"priv-001","operator":"Equals","value":{"Boolean":true}},"weight":4},{"id":"gov-001","category":"Government","title":"Is use by government agencies permitted?","description":"Determine whether national, state, or local government agencies may use this software under the license terms.","tooltip":"Government use may be subject to additional regulations and procurement requirements.","help_text":"Some government agencies have specific software licensing requirements (e.g., DFARS, FAR).","recommended_answer":{"Boolean":true},"legal_implications":"Government agencies may have sovereign immunity that affects license enforcement.","question_type":"Boolean","options":[],"visible_if":null,"weight":7},{"id":"gov-002","category":"Government","title":"What license terms apply to government agencies?","description":"Choose the specific license terms that apply when government agencies use the software.","tooltip":"Government-specific terms can address unique procurement and compliance requirements.","help_text":"Consider whether government agencies receive the same terms as other users or special conditions.","recommended_answer":{"Choice":"same_terms"},"legal_implications":"Government-specific terms must comply with public procurement regulations in the relevant jurisdiction.","question_type":"Choice","options":[{"label":"Same terms as all users","value":"same_terms","description":"No special government terms"},{"label":"Enhanced rights","value":"enhanced","description":"Government agencies receive additional rights"},{"label":"Restricted rights","value":"restricted","description":"Government agencies have limited rights"},{"label":"Custom government license","value":"custom","description":"A separate government-specific license applies"}],"visible_if":{"question_id":"gov-001","operator":"Equals","value":{"Boolean":true}},"weight":6},{"id":"gov-003","category":"Government","title":"Are there restrictions on government use?","description":"Select any restrictions that apply specifically to government use of the software.","tooltip":"Government restrictions can address concerns about surveillance, mass data collection, or human rights.","help_text":"Consider whether specific government departments or agencies should be excluded.","recommended_answer":{"MultiChoice":[]},"legal_implications":"Government restrictions must be clearly defined to avoid being considered discriminatory.","question_type":"MultiChoice","options":[{"label":"Surveillance restrictions","value":"surveillance","description":"Cannot be used for mass surveillance"},{"label":"Human rights restrictions","value":"human_rights","description":"Cannot be used to violate human rights"},{"label":"No government restrictions","value":"none","description":"No restrictions on government use"}],"visible_if":{"question_id":"gov-001","operator":"Equals","value":{"Boolean":true}},"weight":6},{"id":"gov-004","category":"Government","title":"Must the software comply with government procurement standards?","description":"Determine whether the software must meet specific government procurement and compliance standards.","tooltip":"Procurement standards affect how the software can be acquired and used by government agencies.","help_text":"Common standards include FedRAMP, SOC 2, and various ISO certifications.","recommended_answer":{"Boolean":false},"legal_implications":"Non-compliance with procurement standards may exclude the software from government contracts.","question_type":"Boolean","options":[],"visible_if":{"question_id":"gov-001","operator":"Equals","value":{"Boolean":true}},"weight":5},{"id":"mil-001","category":"Military","title":"Is use by military organizations permitted?","description":"Determine whether armed forces and military organizations may use this software.","tooltip":"Military use restrictions are common in ethical and socially responsible licensing.","help_text":"Consider whether all military branches or only specific ones should be restricted.","recommended_answer":{"Boolean":true},"legal_implications":"Military restrictions may limit government adoption and defense-related funding.","question_type":"Boolean","options":[],"visible_if":null,"weight":7},{"id":"mil-002","category":"Military","title":"Which military branches are subject to restrictions?","description":"If military use is restricted, specify which branches or departments are affected.","tooltip":"Different military branches may have different levels of involvement in activities of concern.","help_text":"Consider whether to restrict all branches equally or focus on combat-related units.","recommended_answer":{"MultiChoice":["combat_units"]},"legal_implications":"Partially restricting military use can create enforcement challenges.","question_type":"MultiChoice","options":[{"label":"All military branches","value":"all_branches","description":"Restrictions apply to all armed forces"},{"label":"Combat units only","value":"combat_units","description":"Restrictions apply only to combat-related units"},{"label":"Intelligence agencies","value":"intelligence","description":"Restrictions apply to military intelligence"},{"label":"No military restrictions","value":"none","description":"All military use is permitted"}],"visible_if":{"question_id":"mil-001","operator":"Equals","value":{"Boolean":false}},"weight":6},{"id":"mil-003","category":"Military","title":"Is use by defense contractors permitted?","description":"Determine whether private companies working on military contracts can use the software for defense projects.","tooltip":"Defense contractors occupy a middle ground between commercial and military use.","help_text":"This affects companies like Lockheed Martin, Raytheon, BAE Systems, etc.","recommended_answer":{"Boolean":true},"legal_implications":"Restricting defense contractor use may be difficult to enforce and verify.","question_type":"Boolean","options":[],"visible_if":{"question_id":"mil-001","operator":"Equals","value":{"Boolean":false}},"weight":5},{"id":"mil-004","category":"Military","title":"What military application restrictions apply?","description":"Select restrictions on how the software can be used in military applications.","tooltip":"Application-level restrictions target specific uses rather than users.","help_text":"Consider weapons systems, autonomous weapons, and surveillance applications.","recommended_answer":{"MultiChoice":["weapons_systems"]},"legal_implications":"Application restrictions are easier to enforce than user-based restrictions.","question_type":"MultiChoice","options":[{"label":"Weapons systems","value":"weapons_systems","description":"Cannot be used in weapons development"},{"label":"Autonomous weapons","value":"autonomous_weapons","description":"Cannot be used in autonomous or AI-controlled weapons"},{"label":"Surveillance systems","value":"surveillance","description":"Cannot be used in military surveillance"},{"label":"No application restrictions","value":"none","description":"No restrictions on military applications"}],"visible_if":{"question_id":"mil-001","operator":"Equals","value":{"Boolean":true}},"weight":6},{"id":"ai-001","category":"AiTraining","title":"Is use of this software for AI/ML model training permitted?","description":"Determine whether the software, its source code, documentation, or associated data can be used to train machine learning or AI models.","tooltip":"AI training use is a rapidly evolving area of software licensing that many traditional licenses do not explicitly address.","help_text":"This question is particularly relevant for code, documentation, and datasets included with the software.","recommended_answer":{"Choice":"permitted"},"legal_implications":"Without explicit terms, AI training may fall into a legal gray area depending on jurisdiction and use case.","question_type":"Choice","options":[{"label":"Permitted without restrictions","value":"permitted","description":"AI training is fully allowed"},{"label":"Permitted for non-commercial training","value":"non_commercial","description":"Only non-commercial AI training is allowed"},{"label":"Not permitted","value":"not_permitted","description":"AI training is prohibited"},{"label":"Requires separate license","value":"separate_license","description":"AI training requires a separate commercial license"}],"visible_if":null,"weight":9},{"id":"ai-002","category":"AiTraining","title":"What data requirements apply to AI training?","description":"Specify what data-related obligations apply when using the software for AI training purposes.","tooltip":"Data requirements ensure proper attribution and usage tracking for training datasets.","help_text":"Consider whether training data must be disclosed, anonymized, or sourced ethically.","recommended_answer":{"MultiChoice":["attribution"]},"legal_implications":"Data requirements must comply with applicable data protection and privacy regulations.","question_type":"MultiChoice","options":[{"label":"Attribution of source data","value":"attribution","description":"Must credit the source of training data"},{"label":"Training data disclosure","value":"disclosure","description":"Must disclose what data from this software was used for training"},{"label":"Model card publication","value":"model_card","description":"Must publish a model card describing training data usage"},{"label":"No data requirements","value":"none","description":"No specific data-related obligations"}],"visible_if":{"question_id":"ai-001","operator":"NotEquals","value":{"Choice":"not_permitted"}},"weight":7},{"id":"ai-003","category":"AiTraining","title":"How should AI model outputs be licensed?","description":"Determine the license terms that apply to outputs generated by models trained on this software's code, data, or documentation.","tooltip":"Output licensing affects the commercial viability of AI models trained on the software.","help_text":"Consider whether outputs should inherit the original license or be freely usable.","recommended_answer":{"Choice":"unrestricted"},"legal_implications":"Restricting AI outputs may be legally unenforceable and could deter AI research use.","question_type":"Choice","options":[{"label":"Unrestricted outputs","value":"unrestricted","description":"AI-generated outputs have no license restrictions"},{"label":"Same license applies","value":"same_license","description":"Outputs must be licensed under the same terms"},{"label":"Attribution required","value":"attribution","description":"Outputs must attribute the source software"}],"visible_if":{"question_id":"ai-001","operator":"NotEquals","value":{"Choice":"not_permitted"}},"weight":7},{"id":"ai-004","category":"AiTraining","title":"Is training data attribution required for AI models?","description":"Determine whether AI models trained using this software must acknowledge the source in their documentation or metadata.","tooltip":"Training attribution helps trace the provenance of AI models and acknowledges upstream contributors.","help_text":"Attribution can be included in model cards, documentation, or metadata files.","recommended_answer":{"Boolean":true},"legal_implications":"Training attribution requirements must be practical and reasonable to achieve widespread compliance.","question_type":"Boolean","options":[],"visible_if":{"question_id":"ai-001","operator":"NotEquals","value":{"Choice":"not_permitted"}},"weight":6},{"id":"aiinf-001","category":"AiInference","title":"Is use of AI models trained on this software permitted for inference?","description":"Determine whether models that were trained using this software can be used for inference (making predictions or generating outputs).","tooltip":"Inference use is generally considered less restrictive than training use.","help_text":"Inference is the deployment phase where a trained model produces outputs for end users.","recommended_answer":{"Boolean":true},"legal_implications":"Restricting inference use could effectively prevent deployment of any model that was trained on the software.","question_type":"Boolean","options":[],"visible_if":{"question_id":"ai-001","operator":"NotEquals","value":{"Choice":"not_permitted"}},"weight":7},{"id":"aiinf-002","category":"AiInference","title":"Are there restrictions on inference outputs?","description":"Select restrictions that apply to outputs generated by AI models during inference when using this software.","tooltip":"Output restrictions can prevent the software from being used in certain AI applications.","help_text":"Consider whether outputs are restricted in specific domains like healthcare or finance.","recommended_answer":{"MultiChoice":[]},"legal_implications":"Output restrictions are difficult to enforce in practice, as tracing output provenance is challenging.","question_type":"MultiChoice","options":[{"label":"No output restrictions","value":"none","description":"All outputs are permitted"},{"label":"Commercial use restricted","value":"commercial_restricted","description":"Outputs cannot be used commercially"},{"label":"Attribution required","value":"attribution","description":"Must attribute the source software in outputs"},{"label":"Domain restrictions","value":"domain","description":"Outputs restricted in certain domains"}],"visible_if":{"question_id":"aiinf-001","operator":"Equals","value":{"Boolean":true}},"weight":6},{"id":"aiinf-003","category":"AiInference","title":"Must inference usage be reported?","description":"Determine whether users must report or log when they use AI models for inference using this software.","tooltip":"Usage reporting helps track the impact and reach of the software in AI applications.","help_text":"Reporting requirements are common in enterprise and research licenses.","recommended_answer":{"Boolean":false},"legal_implications":"Mandatory inference reporting can be burdensome and may conflict with privacy regulations.","question_type":"Boolean","options":[],"visible_if":{"question_id":"aiinf-001","operator":"Equals","value":{"Boolean":true}},"weight":5},{"id":"aiinf-004","category":"AiInference","title":"Is commercial inference licensing required?","description":"Determine whether using AI models for commercial inference requires a separate license.","tooltip":"Commercial inference licensing creates a monetization path for AI applications built on the software.","help_text":"This is relevant for companies deploying AI products that incorporate the software.","recommended_answer":{"Choice":"included"},"legal_implications":"Separate commercial inference licensing adds complexity but can generate revenue from AI applications.","question_type":"Choice","options":[{"label":"Included in base license","value":"included","description":"Commercial inference is covered by the main license"},{"label":"Separate license required","value":"separate","description":"Commercial inference requires an additional license"},{"label":"Not permitted for commercial use","value":"not_permitted","description":"Commercial inference is prohibited"}],"visible_if":{"question_id":"aiinf-001","operator":"Equals","value":{"Boolean":true}},"weight":6},{"id":"mw-001","category":"ModelWeights","title":"Are model weights included in the license scope?","description":"Determine whether trained model weights and parameters fall under this license when the software is used for AI training.","tooltip":"Model weights are the numerical parameters learned during training and are distinct from the training code.","help_text":"Separate licensing of weights allows more granular control over AI model distribution.","recommended_answer":{"Boolean":true},"legal_implications":"Including weights in the license scope means they inherit the same terms as the training code.","question_type":"Boolean","options":[],"visible_if":{"question_id":"ai-001","operator":"NotEquals","value":{"Choice":"not_permitted"}},"weight":7},{"id":"mw-002","category":"ModelWeights","title":"What are the model weight distribution terms?","description":"Choose the license terms that apply when distributing trained model weights to third parties.","tooltip":"Weight distribution terms affect how freely trained models can be shared and used.","help_text":"Consider whether weights should be freely distributable or subject to restrictions.","recommended_answer":{"Choice":"same_license"},"legal_implications":"Weight distribution terms must be compatible with the terms of any data used in training.","question_type":"Choice","options":[{"label":"Same license as code","value":"same_license","description":"Weights carry the same license as the training code"},{"label":"Permissive distribution","value":"permissive","description":"Weights can be distributed under any license"},{"label":"Distribution prohibited","value":"prohibited","description":"Weights cannot be distributed separately"},{"label":"Attribution only","value":"attribution","description":"Weights can be distributed with attribution"}],"visible_if":{"question_id":"mw-001","operator":"Equals","value":{"Boolean":true}},"weight":7},{"id":"mw-003","category":"ModelWeights","title":"How should fine-tuned model weights be licensed?","description":"Determine the license terms for model weights that have been fine-tuned or adapted using this software.","tooltip":"Fine-tuned weights are derivatives of the original trained model and raise derivative work questions.","help_text":"This is important for transfer learning workflows where models are adapted for new tasks.","recommended_answer":{"Choice":"sharealike"},"legal_implications":"Fine-tuned weight licensing affects the entire ecosystem of models built on top of the original.","question_type":"Choice","options":[{"label":"Share-alike required","value":"sharealike","description":"Fine-tuned weights must use the same license"},{"label":"Free to relicense","value":"free","description":"Fine-tuned weights can be placed under any license"},{"label":"Must disclose fine-tuning data","value":"disclose_data","description":"Must document what data was used for fine-tuning"}],"visible_if":{"question_id":"mw-001","operator":"Equals","value":{"Boolean":true}},"weight":6},{"id":"mw-004","category":"ModelWeights","title":"Are model weight modifications permitted?","description":"Determine whether licensees can modify, merge, or create derived weights from models trained with this software.","tooltip":"Weight modification rights are essential for model optimization and adaptation workflows.","help_text":"Quantization, pruning, and distillation all involve modifying model weights.","recommended_answer":{"Boolean":true},"legal_implications":"Restricting weight modification could prevent common optimization techniques.","question_type":"Boolean","options":[],"visible_if":{"question_id":"mw-001","operator":"Equals","value":{"Boolean":true}},"weight":6},{"id":"ds-001","category":"DatasetUsage","title":"Is dataset usage covered by this license?","description":"Determine whether datasets bundled with or used by the software are covered under the same license terms.","tooltip":"Datasets may have different licensing needs than the software code itself.","help_text":"Consider whether the dataset has its own license or should be covered by the software license.","recommended_answer":{"Boolean":true},"legal_implications":"Separate dataset licensing can create compatibility issues if not carefully coordinated.","question_type":"Boolean","options":[],"visible_if":null,"weight":7},{"id":"ds-002","category":"DatasetUsage","title":"What are the dataset redistribution terms?","description":"Choose the terms that apply when redistributing datasets that are part of or used with this software.","tooltip":"Dataset redistribution terms affect how training and evaluation data can be shared.","help_text":"Consider whether the dataset should be freely redistributable or subject to restrictions.","recommended_answer":{"Choice":"same_license"},"legal_implications":"Dataset redistribution terms must comply with data protection laws and third-party rights.","question_type":"Choice","options":[{"label":"Same license as software","value":"same_license","description":"Dataset uses the same license as the code"},{"label":"Open Data Commons","value":"odc","description":"Use an Open Data Commons license"},{"label":"Creative Commons","value":"cc","description":"Use a Creative Commons license for the dataset"},{"label":"No redistribution","value":"no_redistribution","description":"Dataset cannot be redistributed"}],"visible_if":{"question_id":"ds-001","operator":"Equals","value":{"Boolean":true}},"weight":6},{"id":"ds-003","category":"DatasetUsage","title":"Are dataset derivative works allowed?","description":"Determine whether modified or augmented versions of the datasets can be created and distributed.","tooltip":"Derivative datasets include cleaned, augmented, translated, or otherwise modified versions.","help_text":"Consider whether derivative datasets must use the same license or can use different terms.","recommended_answer":{"Boolean":true},"legal_implications":"Restricting derivative datasets limits the ability to improve and adapt data for specific uses.","question_type":"Boolean","options":[],"visible_if":{"question_id":"ds-001","operator":"Equals","value":{"Boolean":true}},"weight":6},{"id":"ds-004","category":"DatasetUsage","title":"What dataset attribution requirements apply?","description":"Specify how datasets must be attributed when used in research, products, or other contexts.","tooltip":"Proper dataset attribution ensures data contributors receive credit for their work.","help_text":"Consider requiring citation of the original dataset, DOI references, or specific attribution text.","recommended_answer":{"Text":"Dataset '{name}' from {source} licensed under {license}."},"legal_implications":"Incorrect dataset attribution can violate the terms of datasets with third-party licenses.","question_type":"Text","options":[],"visible_if":{"question_id":"ds-001","operator":"Equals","value":{"Boolean":true}},"weight":5},{"id":"redist-001","category":"Redistribution","title":"Is redistribution of the original software allowed?","description":"Determine whether the unmodified original software can be redistributed to third parties.","tooltip":"Redistribution rights affect how widely the software can be disseminated.","help_text":"Most open-source licenses allow redistribution, but some proprietary licenses restrict it.","recommended_answer":{"Boolean":true},"legal_implications":"Restricting redistribution limits the software's distribution reach and community growth.","question_type":"Boolean","options":[],"visible_if":null,"weight":8},{"id":"redist-002","category":"Redistribution","title":"What conditions apply to redistribution?","description":"Select the conditions that must be met when redistributing the software.","tooltip":"Redistribution conditions define the obligations that accompany sharing the software.","help_text":"Common conditions include license inclusion, source availability, and notices.","recommended_answer":{"MultiChoice":["license_included","notices"]},"legal_implications":"Clear redistribution conditions prevent chain-of-license violations.","question_type":"MultiChoice","options":[{"label":"License must be included","value":"license_included","description":"A copy of the license must accompany redistribution"},{"label":"Copyright notices preserved","value":"notices","description":"All copyright notices must be retained"},{"label":"Source code available","value":"source","description":"Source code must be made available"},{"label":"No conditions","value":"none","description":"Redistribution is unrestricted"}],"visible_if":{"question_id":"redist-001","operator":"Equals","value":{"Boolean":true}},"weight":7},{"id":"redist-003","category":"Redistribution","title":"Can the software be redistributed in combination with other software?","description":"Determine whether the software can be bundled or distributed alongside other software products.","tooltip":"Bundling restrictions affect how the software can be included in distributions and packages.","help_text":"Consider whether combining with proprietary software should be allowed.","recommended_answer":{"Boolean":true},"legal_implications":"Bundling restrictions must not be so broad as to prevent common distribution methods.","question_type":"Boolean","options":[],"visible_if":{"question_id":"redist-001","operator":"Equals","value":{"Boolean":true}},"weight":6},{"id":"redist-004","category":"Redistribution","title":"Are there redistributor obligations beyond the license text?","description":"Specify any additional obligations that redistributors must fulfill beyond including the license.","tooltip":"Additional redistributor obligations can include warranty disclaimers, support notices, or registration requirements.","help_text":"Consider whether redistributors must provide their own warranty disclaimer or notify the original author.","recommended_answer":{"MultiChoice":["warranty_disclaimer"]},"legal_implications":"Extra-statutory obligations can complicate redistribution and deter community participation.","question_type":"MultiChoice","options":[{"label":"Warranty disclaimer required","value":"warranty_disclaimer","description":"Must include a copy of the warranty disclaimer"},{"label":"Author notification","value":"notification","description":"Must notify the original author of redistribution"},{"label":"Registration required","value":"registration","description":"Must register as an official redistributor"},{"label":"No additional obligations","value":"none","description":"Only the standard license conditions apply"}],"visible_if":{"question_id":"redist-001","operator":"Equals","value":{"Boolean":true}},"weight":5},{"id":"resale-001","category":"Resale","title":"Is resale of the software permitted?","description":"Determine whether licensees can sell copies of the software or derivative works for profit.","tooltip":"Resale rights affect the commercial viability of software distribution channels.","help_text":"Some open-source licenses explicitly allow resale; others are silent on the issue.","recommended_answer":{"Boolean":true},"legal_implications":"Restricting resale may conflict with first-sale doctrine in some jurisdictions.","question_type":"Choice","options":[{"label":"Permitted","value":"permitted","description":"Resale is explicitly allowed"},{"label":"Permitted with conditions","value":"conditional","description":"Resale allowed but subject to terms"},{"label":"Not permitted","value":"not_permitted","description":"Resale is prohibited"}],"visible_if":null,"weight":7},{"id":"resale-002","category":"Resale","title":"Are there resale pricing restrictions?","description":"Determine whether there are any restrictions on the price at which the software can be resold.","tooltip":"Price restrictions can prevent gouging but may also be considered anti-competitive.","help_text":"Consider whether to cap resale prices, require cost-only distribution, or allow free pricing.","recommended_answer":{"Choice":"free_pricing"},"legal_implications":"Price fixing or restrictions may violate antitrust laws in some jurisdictions.","question_type":"Choice","options":[{"label":"Free pricing","value":"free_pricing","description":"No restrictions on resale price"},{"label":"Cost recovery only","value":"cost_only","description":"Can only charge for distribution costs"},{"label":"Capped margin","value":"capped","description":"Profit margin must not exceed a specified percentage"}],"visible_if":{"question_id":"resale-001","operator":"Equals","value":{"Choice":"permitted"}},"weight":6},{"id":"resale-003","category":"Resale","title":"Is revenue sharing required on resale?","description":"Determine whether a percentage of resale revenue must be shared with the original copyright holder.","tooltip":"Revenue sharing provides ongoing financial support to the original developers.","help_text":"Typical revenue sharing percentages range from 5% to 30% of resale revenue.","recommended_answer":{"Number":0},"legal_implications":"Revenue sharing arrangements must be clearly defined and enforceable.","question_type":"Number","options":[],"visible_if":{"question_id":"resale-001","operator":"Equals","value":{"Choice":"permitted"}},"weight":6},{"id":"resale-004","category":"Resale","title":"Must resale activities be reported to the licensor?","description":"Determine whether resellers must report their resale activities, including sales volume and revenue, to the licensor.","tooltip":"Reporting requirements help the licensor track commercial use and enforce revenue sharing.","help_text":"Reporting frequency can range from monthly to annually.","recommended_answer":{"Boolean":false},"legal_implications":"Mandatory reporting adds administrative burden and may raise privacy concerns.","question_type":"Boolean","options":[],"visible_if":{"question_id":"resale-001","operator":"Equals","value":{"Choice":"permitted"}},"weight":5},{"id":"host-001","category":"Hosting","title":"Is hosting of the software for third parties permitted?","description":"Determine whether the software can be hosted on servers and made available to third-party users as a service.","tooltip":"Hosting rights determine whether the software can be offered as a managed service.","help_text":"This is distinct from internal hosting; this question concerns hosting for external users.","recommended_answer":{"Boolean":true},"legal_implications":"Restricting hosting can significantly limit the software's use in modern cloud-based architectures.","question_type":"Boolean","options":[],"visible_if":null,"weight":8},{"id":"host-002","category":"Hosting","title":"Are there hosting service restrictions?","description":"Select the restrictions that apply when hosting the software as a service for third parties.","tooltip":"Hosting restrictions help control how the software is deployed and monetized in cloud environments.","help_text":"Consider whether to restrict specific types of hosting or allow unrestricted hosting.","recommended_answer":{"MultiChoice":["attribution"]},"legal_implications":"Overly restrictive hosting terms may prevent the software from being used in common deployment patterns.","question_type":"MultiChoice","options":[{"label":"Attribution required","value":"attribution","description":"Must attribute the software to users"},{"label":"Source disclosure required","value":"source_disclosure","description":"Must provide source code to hosted users"},{"label":"Notification required","value":"notification","description":"Must notify the licensor of hosting deployment"},{"label":"No hosting restrictions","value":"none","description":"Hosting is unrestricted"}],"visible_if":{"question_id":"host-001","operator":"Equals","value":{"Boolean":true}},"weight":7},{"id":"host-003","category":"Hosting","title":"Does hosting require a separate license?","description":"Determine whether hosting the software for third parties requires obtaining a separate hosting license.","tooltip":"Separate hosting licenses are common in commercial open-source models.","help_text":"This creates a clear distinction between free use and commercial hosting.","recommended_answer":{"Boolean":false},"legal_implications":"Separate hosting licensing requires clear definitions of what constitutes hosting vs. internal use.","question_type":"Boolean","options":[],"visible_if":{"question_id":"host-001","operator":"Equals","value":{"Boolean":true}},"weight":7},{"id":"host-004","category":"Hosting","title":"Must hosting providers offer SLA guarantees?","description":"Determine whether hosting providers must offer specific service level agreements for hosted instances of the software.","tooltip":"SLA requirements protect users who depend on the hosted service for critical operations.","help_text":"Consider minimum uptime guarantees, response times, and support availability.","recommended_answer":{"Boolean":false},"legal_implications":"Mandatory SLA requirements may deter smaller hosting providers from offering the service.","question_type":"Boolean","options":[],"visible_if":{"question_id":"host-001","operator":"Equals","value":{"Boolean":true}},"weight":4},{"id":"cloud-001","category":"Cloud","title":"Is cloud deployment of the software permitted?","description":"Determine whether the software can be deployed on cloud infrastructure (AWS, Azure, GCP, etc.).","tooltip":"Cloud deployment rights are essential for modern software distribution and SaaS models.","help_text":"Consider whether cloud deployment is treated differently from on-premises deployment.","recommended_answer":{"Boolean":true},"legal_implications":"Restricting cloud deployment may prevent the software from being used in modern infrastructure environments.","question_type":"Boolean","options":[],"visible_if":null,"weight":8},{"id":"cloud-002","category":"Cloud","title":"Are there cloud provider restrictions?","description":"Select whether the software can only be deployed on specific cloud platforms or if deployment on any provider is permitted.","tooltip":"Cloud provider restrictions can create vendor lock-in or exclusivity arrangements.","help_text":"Some licenses restrict deployment to specific cloud providers as part of partnership agreements.","recommended_answer":{"MultiChoice":["any_provider"]},"legal_implications":"Provider restrictions may conflict with multi-cloud strategies and reduce deployment flexibility.","question_type":"MultiChoice","options":[{"label":"Any cloud provider","value":"any_provider","description":"Can deploy on any cloud platform"},{"label":"Approved providers only","value":"approved_only","description":"Limited to a list of approved cloud providers"},{"label":"Self-hosted only","value":"self_hosted","description":"Cannot use third-party cloud services"}],"visible_if":{"question_id":"cloud-001","operator":"Equals","value":{"Boolean":true}},"weight":7},{"id":"cloud-003","category":"Cloud","title":"Is cloud usage metering required?","description":"Determine whether cloud deployments must meter and report usage to the licensor.","tooltip":"Usage metering enables consumption-based licensing models and usage tracking.","help_text":"Metering can be implemented through API calls, telemetry, or self-reported usage data.","recommended_answer":{"Boolean":false},"legal_implications":"Mandatory metering can increase deployment complexity and operational overhead.","question_type":"Boolean","options":[],"visible_if":{"question_id":"cloud-001","operator":"Equals","value":{"Boolean":true}},"weight":6},{"id":"cloud-004","category":"Cloud","title":"How should multi-tenant cloud deployments be licensed?","description":"Choose the licensing model for cloud deployments where a single instance serves multiple tenants or customers.","tooltip":"Multi-tenant licensing determines whether each tenant requires a separate license or a single license covers all tenants.","help_text":"Per-tenant licensing is common in SaaS; per-instance licensing is common in PaaS.","recommended_answer":{"Choice":"per_instance"},"legal_implications":"Multi-tenant licensing models must clearly define what constitutes a 'tenant' or 'user'.","question_type":"Choice","options":[{"label":"Per instance","value":"per_instance","description":"One license per deployed instance regardless of tenants"},{"label":"Per tenant","value":"per_tenant","description":"Each tenant requires a separate license"},{"label":"Per user","value":"per_user","description":"Each end user requires a separate license"},{"label":"Unlimited tenants","value":"unlimited","description":"No restrictions on number of tenants"}],"visible_if":{"question_id":"cloud-001","operator":"Equals","value":{"Boolean":true}},"weight":7},{"id":"saas-001","category":"Saas","title":"Is SaaS deployment of the software permitted?","description":"Determine whether the software can be offered as a Software-as-a-Service product to end users.","tooltip":"SaaS deployment involves making the software available over the internet as an application service.","help_text":"SaaS is distinct from hosting; it specifically involves providing the software as a managed application service.","recommended_answer":{"Choice":"permitted"},"legal_implications":"SaaS deployment often triggers different license obligations than on-premises deployment.","question_type":"Choice","options":[{"label":"Permitted","value":"permitted","description":"SaaS deployment is fully allowed"},{"label":"Permitted with conditions","value":"conditional","description":"SaaS deployment allowed under specific terms"},{"label":"Requires separate license","value":"separate_license","description":"SaaS requires a separate commercial license"},{"label":"Not permitted","value":"not_permitted","description":"SaaS deployment is prohibited"}],"visible_if":null,"weight":9},{"id":"saas-002","category":"Saas","title":"Is revenue sharing required for SaaS deployments?","description":"Determine whether SaaS providers must share a percentage of subscription revenue with the licensor.","tooltip":"Revenue sharing creates a recurring revenue stream for the original software developers.","help_text":"Typical SaaS revenue sharing ranges from 5% to 25% of subscription revenue.","recommended_answer":{"Number":0},"legal_implications":"Revenue sharing terms must be clearly defined and auditable to prevent disputes.","question_type":"Number","options":[],"visible_if":{"question_id":"saas-001","operator":"Equals","value":{"Choice":"permitted"}},"weight":7},{"id":"saas-003","category":"Saas","title":"Are there user count limitations for SaaS deployments?","description":"Specify the maximum number of concurrent or total users allowed under a SaaS deployment license.","tooltip":"User limits help control the scale of SaaS deployments and align licensing with capacity planning.","help_text":"Consider whether limits apply to concurrent users, registered users, or total users.","recommended_answer":{"Number":0},"legal_implications":"User limits must be technically enforceable and clearly communicated to SaaS operators.","question_type":"Number","options":[],"visible_if":{"question_id":"saas-001","operator":"Equals","value":{"Choice":"permitted"}},"weight":6},{"id":"saas-004","category":"Saas","title":"Must SaaS providers display specific branding?","description":"Determine whether SaaS providers must display the original software's branding, logo, or attribution on their service.","tooltip":"Branding requirements help maintain the original project's visibility in the market.","help_text":"Consider whether branding must be prominent or can be subtle (e.g., footer attribution).","recommended_answer":{"Boolean":false},"legal_implications":"Mandatory branding may conflict with the SaaS provider's own brand identity requirements.","question_type":"Boolean","options":[],"visible_if":{"question_id":"saas-001","operator":"Equals","value":{"Choice":"permitted"}},"weight":5},{"id":"paas-001","category":"Paas","title":"Is PaaS deployment of the software permitted?","description":"Determine whether the software can be offered as a Platform-as-a-Service component for building and deploying applications.","tooltip":"PaaS deployment involves providing the software as part of a development or deployment platform.","help_text":"PaaS is distinct from SaaS in that it provides infrastructure for building applications rather than serving end users directly.","recommended_answer":{"Boolean":true},"legal_implications":"PaaS licensing can be complex due to the multi-layered nature of platform services.","question_type":"Boolean","options":[],"visible_if":null,"weight":7},{"id":"paas-002","category":"Paas","title":"Are there PaaS integration restrictions?","description":"Select restrictions on how the software can be integrated into PaaS offerings.","tooltip":"Integration restrictions control how deeply the software is embedded in the platform.","help_text":"Consider whether the software can be offered as a standalone service or must be part of a larger platform.","recommended_answer":{"MultiChoice":["attribution"]},"legal_implications":"Integration restrictions must be specific enough to be enforceable but not so broad as to be impractical.","question_type":"MultiChoice","options":[{"label":"Attribution required","value":"attribution","description":"Must credit the software in platform documentation"},{"label":"Cannot be sole component","value":"not_sole","description":"Software must be part of a larger platform offering"},{"label":"No PaaS restrictions","value":"none","description":"PaaS integration is unrestricted"}],"visible_if":{"question_id":"paas-001","operator":"Equals","value":{"Boolean":true}},"weight":6},{"id":"paas-003","category":"Paas","title":"What PaaS licensing model should be used?","description":"Choose the licensing model for PaaS deployments of the software.","tooltip":"PaaS licensing models determine how fees are calculated for platform usage.","help_text":"Consider usage-based, subscription-based, or per-seat models for PaaS licensing.","recommended_answer":{"Choice":"usage_based"},"legal_implications":"PaaS licensing models must align with how the platform is actually consumed by end users.","question_type":"Choice","options":[{"label":"Usage-based","value":"usage_based","description":"Fees based on actual platform usage (API calls, compute time, etc.)"},{"label":"Subscription-based","value":"subscription","description":"Fixed monthly or annual subscription fee"},{"label":"Per-developer","value":"per_developer","description":"Fee per developer using the platform"},{"label":"Free with attribution","value":"free_attribution","description":"Free to use with proper attribution"}],"visible_if":{"question_id":"paas-001","operator":"Equals","value":{"Boolean":true}},"weight":6},{"id":"paas-004","category":"Paas","title":"What data handling requirements apply to PaaS deployments?","description":"Specify the requirements for how user data is handled within PaaS deployments of the software.","tooltip":"Data handling requirements ensure compliance with privacy regulations and user expectations.","help_text":"Consider data retention, encryption, access controls, and deletion policies.","recommended_answer":{"Text":"PaaS providers must comply with applicable data protection regulations and maintain appropriate security measures."},"legal_implications":"Data handling requirements must comply with GDPR, CCPA, and other applicable privacy regulations.","question_type":"Text","options":[],"visible_if":{"question_id":"paas-001","operator":"Equals","value":{"Boolean":true}},"weight":5},{"id":"cont-001","category":"Containers","title":"Is containerization of the software permitted?","description":"Determine whether the software can be packaged and distributed as container images (Docker, OCI, etc.).","tooltip":"Containerization is a standard deployment method for modern applications.","help_text":"Consider whether container images are treated the same as binary distributions.","recommended_answer":{"Boolean":true},"legal_implications":"Container packaging may trigger different distribution obligations depending on how containers are treated under the license.","question_type":"Boolean","options":[],"visible_if":null,"weight":7},{"id":"cont-002","category":"Containers","title":"Can container images be redistributed?","description":"Determine whether container images containing the software can be redistributed through registries or other channels.","tooltip":"Container redistribution rights affect how the software can be shared in container ecosystems.","help_text":"Consider public registries (Docker Hub, GHCR) and private registries.","recommended_answer":{"Choice":"with_license"},"legal_implications":"Container redistribution must comply with the same license terms as binary distribution.","question_type":"Choice","options":[{"label":"Redistribution with license","value":"with_license","description":"Can redistribute if license is included"},{"label":"Redistribution prohibited","value":"prohibited","description":"Container images cannot be redistributed"},{"label":"Redistribution unrestricted","value":"unrestricted","description":"Can redistribute without restrictions"}],"visible_if":{"question_id":"cont-001","operator":"Equals","value":{"Boolean":true}},"weight":6},{"id":"cont-003","category":"Containers","title":"Are there base image restrictions for containers?","description":"Specify whether the software can only be packaged with certain base images or base image licenses.","tooltip":"Base image restrictions can affect the overall license compliance of the container.","help_text":"Consider whether GPL-licensed base images should be allowed or avoided.","recommended_answer":{"MultiChoice":["any_base"]},"legal_implications":"Base image license compatibility is important for overall container license compliance.","question_type":"MultiChoice","options":[{"label":"Any base image","value":"any_base","description":"No restrictions on base image selection"},{"label":"License-compatible only","value":"compatible","description":"Base image must have compatible license"},{"label":"Approved base images only","value":"approved","description":"Must use base images from an approved list"}],"visible_if":{"question_id":"cont-001","operator":"Equals","value":{"Boolean":true}},"weight":5},{"id":"cont-004","category":"Containers","title":"What orchestration platform terms apply?","description":"Specify the terms that apply when the software is deployed using container orchestration platforms like Kubernetes.","tooltip":"Orchestration platforms add another layer of deployment complexity to license compliance.","help_text":"Consider whether Kubernetes, Docker Swarm, or other orchestration tools affect license obligations.","recommended_answer":{"Text":"The software can be deployed on any standards-compliant container orchestration platform."},"legal_implications":"Orchestrated deployments may involve multiple copies of the software, potentially triggering per-instance licensing.","question_type":"Text","options":[],"visible_if":{"question_id":"cont-001","operator":"Equals","value":{"Boolean":true}},"weight":4},{"id":"oem-001","category":"Oem","title":"Is OEM bundling of the software permitted?","description":"Determine whether the software can be bundled with hardware or other software products for resale by OEM partners.","tooltip":"OEM bundling allows the software to reach a wider audience through hardware and software partnerships.","help_text":"OEM arrangements typically involve volume licensing and special distribution terms.","recommended_answer":{"Choice":"with_license"},"legal_implications":"OEM licensing requires careful coordination of license terms between the software provider, OEM partner, and end users.","question_type":"Choice","options":[{"label":"Permitted with OEM license","value":"with_license","description":"OEM bundling requires a specific OEM license agreement"},{"label":"Permitted without restrictions","value":"unrestricted","description":"OEM bundling is freely allowed"},{"label":"Not permitted","value":"not_permitted","description":"OEM bundling is prohibited"},{"label":"Requires approval","value":"approval","description":"OEM bundling requires prior written approval"}],"visible_if":null,"weight":7},{"id":"oem-002","category":"Oem","title":"Are there OEM license fees?","description":"Determine whether OEM partners must pay per-unit or volume-based fees for bundling the software.","tooltip":"OEM fees help monetize the software's distribution through hardware and software channels.","help_text":"Consider per-unit fees, volume discounts, or revenue-sharing arrangements.","recommended_answer":{"Number":0},"legal_implications":"OEM fee structures must be clearly defined and documented in the OEM agreement.","question_type":"Number","options":[],"visible_if":{"question_id":"oem-001","operator":"Equals","value":{"Choice":"with_license"}},"weight":6},{"id":"oem-003","category":"Oem","title":"What OEM branding requirements apply?","description":"Select the branding and attribution requirements for OEM bundles containing the software.","tooltip":"OEM branding ensures the software receives proper credit in bundled products.","help_text":"Consider logo placement, text attribution, and documentation requirements.","recommended_answer":{"MultiChoice":["attribution"]},"legal_implications":"Branding requirements must be reasonable and not interfere with the OEM's own branding needs.","question_type":"MultiChoice","options":[{"label":"Logo placement required","value":"logo","description":"Must display the software's logo on packaging or documentation"},{"label":"Text attribution required","value":"attribution","description":"Must include text attribution in product documentation"},{"label":"Splash screen attribution","value":"splash","description":"Must show attribution during product startup"},{"label":"No branding requirements","value":"none","description":"No specific branding obligations"}],"visible_if":{"question_id":"oem-001","operator":"Equals","value":{"Choice":"with_license"}},"weight":5},{"id":"oem-004","category":"Oem","title":"Do OEM partners have support obligations?","description":"Determine whether OEM partners must provide end-user support for the software component of their bundled product.","tooltip":"Support obligations ensure end users have access to help when using the software.","help_text":"Consider whether support can be provided by the original developer or must be handled by the OEM partner.","recommended_answer":{"Boolean":true},"legal_implications":"Undefined support obligations can lead to poor end-user experience and damage the software's reputation.","question_type":"Boolean","options":[],"visible_if":{"question_id":"oem-001","operator":"Equals","value":{"Choice":"with_license"}},"weight":5},{"id":"attr-001","category":"Attribution","title":"Is attribution of the original authors required?","description":"Determine whether all users and distributors must credit the original authors of the software.","tooltip":"Attribution requirements ensure that original developers receive recognition for their work.","help_text":"Most open-source licenses require some form of attribution when distributing the software.","recommended_answer":{"Boolean":true},"legal_implications":"Failure to require attribution can result in loss of recognition for original contributors.","question_type":"Boolean","options":[],"visible_if":null,"weight":8},{"id":"attr-002","category":"Attribution","title":"What format must the attribution take?","description":"Specify the exact format and content required for attribution notices.","tooltip":"Standardized attribution formats ensure consistency across all distributions and uses.","help_text":"Consider whether a simple text notice, a specific citation format, or a link to an attribution page is sufficient.","recommended_answer":{"Text":"This product includes software developed by {author} ({url})."},"legal_implications":"Vague attribution requirements can lead to inconsistent compliance across the user community.","question_type":"Text","options":[],"visible_if":{"question_id":"attr-001","operator":"Equals","value":{"Boolean":true}},"weight":7},{"id":"attr-003","category":"Attribution","title":"Where must attribution appear?","description":"Select the locations where attribution notices must be displayed.","tooltip":"Placement requirements determine how prominently the attribution is displayed to users.","help_text":"Common locations include source code, documentation, about pages, and product packaging.","recommended_answer":{"MultiChoice":["documentation","about_page"]},"legal_implications":"Attribution that is hidden or hard to find may not satisfy legal attribution requirements.","question_type":"MultiChoice","options":[{"label":"Source code files","value":"source_code","description":"Attribution must appear in source code headers"},{"label":"Documentation","value":"documentation","description":"Attribution must appear in user documentation"},{"label":"About page or screen","value":"about_page","description":"Attribution must appear in the application's about page"},{"label":"Product packaging","value":"packaging","description":"Attribution must appear on physical or digital packaging"}],"visible_if":{"question_id":"attr-001","operator":"Equals","value":{"Boolean":true}},"weight":6},{"id":"attr-004","category":"Attribution","title":"Can attribution notices be modified by downstream users?","description":"Determine whether downstream users can modify, append to, or reformat the required attribution notices.","tooltip":"Allowing modification of attribution notices can lead to inconsistent or misleading attributions.","help_text":"Some licenses allow adding additional attribution while preserving the original notice.","recommended_answer":{"Choice":"add_only"},"legal_implications":"Modification of attribution notices can dilute their effectiveness and create confusion about authorship.","question_type":"Choice","options":[{"label":"Cannot be modified","value":"no_modification","description":"Original attribution must be reproduced exactly"},{"label":"Can add additional attribution","value":"add_only","description":"Can append additional attribution but not modify original"},{"label":"Can be freely modified","value":"free_modification","description":"Attribution can be reformatted or reworded"}],"visible_if":{"question_id":"attr-001","operator":"Equals","value":{"Boolean":true}},"weight":5},{"id":"noti-001","category":"Notice","title":"Are license notices required beyond attribution?","description":"Determine whether additional license notices (beyond attribution) must be included with the software distribution.","tooltip":"License notices help recipients understand their rights and obligations under the license.","help_text":"Consider whether the full license text, a summary, or a link to the license is sufficient.","recommended_answer":{"Boolean":true},"legal_implications":"Missing license notices can create ambiguity about the terms under which the software is provided.","question_type":"Boolean","options":[],"visible_if":null,"weight":7},{"id":"noti-002","category":"Notice","title":"Where must license notices be placed?","description":"Select the locations where license notices must be included or displayed.","tooltip":"Proper notice placement ensures that all recipients are aware of the license terms.","help_text":"Consider whether notices must appear in source code, binaries, documentation, or all of the above.","recommended_answer":{"MultiChoice":["readme","license_file"]},"legal_implications":"Insufficient notice placement can weaken the enforceability of license terms.","question_type":"MultiChoice","options":[{"label":"README or similar file","value":"readme","description":"Notice must be included in a README or equivalent file"},{"label":"LICENSE file","value":"license_file","description":"Full license text must be included as a LICENSE file"},{"label":"Source code headers","value":"source_headers","description":"Each source file must contain a license notice"},{"label":"Binary distribution","value":"binary","description":"Notice must be included with binary distributions"}],"visible_if":{"question_id":"noti-001","operator":"Equals","value":{"Boolean":true}},"weight":6},{"id":"noti-003","category":"Notice","title":"What content must the license notice contain?","description":"Specify the required content of the license notice beyond the basic attribution.","tooltip":"Detailed notices help recipients understand all applicable license terms and conditions.","help_text":"Consider including copyright notices, license references, warranty disclaimers, and modification notices.","recommended_answer":{"Text":"{copyright}\nLicensed under {license_name}.\nSee {license_url} for details."},"legal_implications":"Incomplete notices may not satisfy the license's notice requirements, potentially constituting a breach.","question_type":"Text","options":[],"visible_if":{"question_id":"noti-001","operator":"Equals","value":{"Boolean":true}},"weight":5},{"id":"noti-004","category":"Notice","title":"Can license notices be removed by downstream users?","description":"Determine whether downstream users are permitted to remove or modify the license notices from the software.","tooltip":"Removable notices can lead to the software being distributed without proper license information.","help_text":"Most licenses prohibit removal of license notices; some allow modification under certain conditions.","recommended_answer":{"Boolean":false},"legal_implications":"Allowing notice removal can result in license violations by downstream recipients who are unaware of their obligations.","question_type":"Boolean","options":[],"visible_if":{"question_id":"noti-001","operator":"Equals","value":{"Boolean":true}},"weight":6},{"id":"war-001","category":"Warranty","title":"Is warranty provided with the software?","description":"Determine whether the licensor provides any warranty for the software's functionality, fitness, or performance.","tooltip":"Warranty provisions protect users from defective software and define the licensor's liability for failures.","help_text":"Most open-source licenses include a warranty disclaimer; commercial licenses may include a limited warranty.","recommended_answer":{"Choice":"disclaimer"},"legal_implications":"Providing or disclaiming warranty has significant legal implications for both the licensor and licensee.","question_type":"Choice","options":[{"label":"Full warranty disclaimer","value":"disclaimer","description":"Software provided 'AS IS' with no warranty"},{"label":"Limited warranty","value":"limited","description":"Warranty covers specific aspects for a defined period"},{"label":"Full warranty","value":"full","description":"Software is provided with a comprehensive warranty"},{"label":"No warranty clause","value":"none","description":"The license does not address warranty at all"}],"visible_if":null,"weight":9},{"id":"war-002","category":"Warranty","title":"What is the warranty duration?","description":"Specify the length of time for which the warranty (if any) remains in effect after the software is provided.","tooltip":"Warranty duration defines the period during which the licensor accepts responsibility for defects.","help_text":"Common warranty periods range from 30 days to 2 years for commercial software.","recommended_answer":{"Choice":"none"},"legal_implications":"Warranty duration must be clearly stated to avoid disputes about when coverage expires.","question_type":"Choice","options":[{"label":"No warranty (disclaimed)","value":"none","description":"No warranty period applies"},{"label":"30 days","value":"30_days","description":"Warranty valid for 30 days from delivery"},{"label":"90 days","value":"90_days","description":"Warranty valid for 90 days from delivery"},{"label":"1 year","value":"1_year","description":"Warranty valid for 1 year from delivery"}],"visible_if":{"question_id":"war-001","operator":"NotEquals","value":{"Choice":"disclaimer"}},"weight":7},{"id":"war-003","category":"Warranty","title":"What does the warranty cover?","description":"Select the aspects of the software that are covered by the warranty (if any).","tooltip":"Warranty scope determines which types of defects or failures the licensor accepts responsibility for.","help_text":"Consider covering bugs, security vulnerabilities, performance guarantees, and documentation accuracy.","recommended_answer":{"MultiChoice":["bugs"]},"legal_implications":"Warranty scope must be clearly defined to prevent disputes about what constitutes a covered defect.","question_type":"MultiChoice","options":[{"label":"Freedom from defects","value":"bugs","description":"Warranty that the software is free from known bugs"},{"label":"Security vulnerabilities","value":"security","description":"Warranty against known security vulnerabilities"},{"label":"Performance guarantees","value":"performance","description":"Warranty that the software meets specified performance criteria"},{"label":"Documentation accuracy","value":"documentation","description":"Warranty that documentation is accurate and complete"}],"visible_if":{"question_id":"war-001","operator":"NotEquals","value":{"Choice":"disclaimer"}},"weight":7},{"id":"war-004","category":"Warranty","title":"Is an express warranty disclaimer included?","description":"Determine whether the license includes an explicit disclaimer of all warranties, as is common in open-source licenses.","tooltip":"Express warranty disclaimers provide clear notice to users that no warranties are provided.","help_text":"The classic disclaimer language is: 'THE SOFTWARE IS PROVIDED AS IS, WITHOUT WARRANTY OF ANY KIND.'","recommended_answer":{"Boolean":true},"legal_implications":"Without an express disclaimer, implied warranties may apply by default under applicable law.","question_type":"Boolean","options":[],"visible_if":{"question_id":"war-001","operator":"Equals","value":{"Choice":"disclaimer"}},"weight":8},{"id":"liab-001","category":"Liability","title":"Is liability limitation included in the license?","description":"Determine whether the license includes a limitation of liability clause that caps the licensor's financial exposure.","tooltip":"Liability limitations protect the licensor from excessive financial claims arising from software defects or damages.","help_text":"Most open-source licenses include a limitation of liability clause; commercial licenses may negotiate limits.","recommended_answer":{"Boolean":true},"legal_implications":"Without a liability limitation, the licensor could be exposed to unlimited damages claims.","question_type":"Boolean","options":[],"visible_if":null,"weight":9},{"id":"liab-002","category":"Liability","title":"What is the maximum liability amount?","description":"Set the maximum amount of damages that the licensor can be held liable for under the license.","tooltip":"Liability caps provide predictability for both the licensor and licensee regarding potential financial exposure.","help_text":"Common caps include the license fee paid, a fixed dollar amount, or actual damages up to a limit.","recommended_answer":{"Choice":"license_fee"},"legal_implications":"Unreasonably low liability caps may be considered unconscionable in some jurisdictions.","question_type":"Choice","options":[{"label":"License fee paid","value":"license_fee","description":"Liability capped at the fees paid for the license"},{"label":"Fixed amount","value":"fixed","description":"Liability capped at a specific dollar amount"},{"label":"No liability","value":"no_liability","description":"Licensor assumes no liability whatsoever"},{"label":"Uncapped","value":"uncapped","description":"No limitation on liability amount"}],"visible_if":{"question_id":"liab-001","operator":"Equals","value":{"Boolean":true}},"weight":8},{"id":"liab-003","category":"Liability","title":"What types of liability are excluded?","description":"Select the types of damages that are excluded from the liability limitation.","tooltip":"Excluded damage types define what kinds of harm the licensor will not compensate for.","help_text":"Common exclusions include indirect, incidental, consequential, and punitive damages.","recommended_answer":{"MultiChoice":["indirect","consequential","punitive"]},"legal_implications":"Overly broad exclusions may leave licensees without recourse for genuine harm caused by defective software.","question_type":"MultiChoice","options":[{"label":"Indirect damages","value":"indirect","description":"Excludes indirect and incidental damages"},{"label":"Consequential damages","value":"consequential","description":"Excludes consequential damages (lost profits, etc.)"},{"label":"Punitive damages","value":"punitive","description":"Excludes punitive or exemplary damages"},{"label":"Data loss","value":"data_loss","description":"Excludes liability for data loss or corruption"}],"visible_if":{"question_id":"liab-001","operator":"Equals","value":{"Boolean":true}},"weight":7},{"id":"liab-004","category":"Liability","title":"Is indemnification required from the licensor?","description":"Determine whether the licensor must indemnify (defend and compensate) licensees against third-party claims arising from the software.","tooltip":"Indemnification protects licensees from legal costs and damages if the software infringes third-party rights.","help_text":"Indemnification is common in commercial licenses but rare in open-source licenses.","recommended_answer":{"Boolean":false},"legal_implications":"Indemnification obligations can expose the licensor to significant financial risk from patent trolls and other claimants.","question_type":"Boolean","options":[],"visible_if":{"question_id":"liab-001","operator":"Equals","value":{"Boolean":true}},"weight":7},{"id":"term-001","category":"Termination","title":"Under what conditions does the license terminate?","description":"Select the events that cause the license to terminate automatically or upon notice.","tooltip":"Termination conditions define when a licensee loses their rights under the license.","help_text":"Common triggers include license violation, patent litigation, and insolvency.","recommended_answer":{"MultiChoice":["license_violation"]},"legal_implications":"Overly aggressive termination conditions can make the license impractical for many users.","question_type":"MultiChoice","options":[{"label":"License violation","value":"license_violation","description":"License terminates if the licensee breaches any terms"},{"label":"Patent litigation","value":"patent_litigation","description":"License terminates if the licensee sues for patent infringement"},{"label":"Insolvency","value":"insolvency","description":"License terminates if the licensee becomes insolvent or bankrupt"},{"label":"Never terminates","value":"never","description":"The license grants perpetual rights"}],"visible_if":null,"weight":9},{"id":"term-002","category":"Termination","title":"Is there a cure period for license violations?","description":"Determine whether licensees are given an opportunity to fix violations before the license terminates.","tooltip":"Cure periods provide a grace period for correcting accidental or unintentional violations.","help_text":"A cure period is considered a best practice for open-source licensing as it prevents harsh outcomes for minor violations.","recommended_answer":{"Boolean":true},"legal_implications":"Immediate termination for minor violations can be seen as disproportionate and may reduce adoption.","question_type":"Boolean","options":[],"visible_if":{"question_id":"term-001","operator":"Equals","value":{"Choice":"license_violation"}},"weight":8},{"id":"term-003","category":"Termination","title":"What is the cure period duration?","description":"Specify the length of the cure period during which licensees can fix violations before the license terminates.","tooltip":"The cure period duration balances the need for prompt remediation with fairness to the licensee.","help_text":"Common cure periods range from 15 to 60 days depending on the severity of the violation.","recommended_answer":{"Choice":"30_days"},"legal_implications":"The cure period must be reasonable and practically achievable for the type of violation involved.","question_type":"Choice","options":[{"label":"15 days","value":"15_days","description":"15 calendar days to cure the violation"},{"label":"30 days","value":"30_days","description":"30 calendar days to cure the violation"},{"label":"60 days","value":"60_days","description":"60 calendar days to cure the violation"},{"label":"90 days","value":"90_days","description":"90 calendar days to cure the violation"}],"visible_if":{"question_id":"term-002","operator":"Equals","value":{"Boolean":true}},"weight":7},{"id":"term-004","category":"Termination","title":"What post-termination obligations exist?","description":"Select the obligations that continue to apply after the license is terminated.","tooltip":"Post-termination obligations ensure that the effects of the license continue to protect both parties after termination.","help_text":"Common post-termination obligations include destruction of copies and survival of warranty disclaimers.","recommended_answer":{"MultiChoice":["destroy_copies","survive_disclaimers"]},"legal_implications":"Post-termination obligations must be clearly defined and practically enforceable.","question_type":"MultiChoice","options":[{"label":"Destroy all copies","value":"destroy_copies","description":"Must destroy all copies of the software"},{"label":"Warranty disclaimers survive","value":"survive_disclaimers","description":"Warranty disclaimers remain in effect after termination"},{"label":"Indemnification survives","value":"survive_indemnification","description":"Indemnification obligations survive termination"},{"label":"No post-termination obligations","value":"none","description":"No obligations survive termination"}],"visible_if":{"question_id":"term-001","operator":"NotEquals","value":{"Choice":"never"}},"weight":6},{"id":"rev-001","category":"Revocation","title":"Can the license be revoked by the licensor?","description":"Determine whether the licensor has the right to revoke the license after it has been granted.","tooltip":"License revocation gives the licensor the ability to withdraw rights under certain circumstances.","help_text":"Consider whether revocation should be possible and under what conditions.","recommended_answer":{"Choice":"for_cause"},"legal_implications":"Revocable licenses provide less security to licensees than irrevocable licenses.","question_type":"Choice","options":[{"label":"Revocable for cause","value":"for_cause","description":"License can be revoked only for material breach"},{"label":"Revocable at will","value":"at_will","description":"License can be revoked at any time by the licensor"},{"label":"Irrevocable","value":"irrevocable","description":"License cannot be revoked once granted"}],"visible_if":null,"weight":8},{"id":"rev-002","category":"Revocation","title":"What notice is required for license revocation?","description":"Specify the notification requirements when the licensor intends to revoke the license.","tooltip":"Proper revocation notice gives licensees time to transition away from the software.","help_text":"Consider whether written notice, email notification, or public announcement is sufficient.","recommended_answer":{"Text":"Written notice must be provided at least 30 days before revocation takes effect."},"legal_implications":"Revocation without proper notice may be considered bad faith and unenforceable.","question_type":"Text","options":[],"visible_if":{"question_id":"rev-001","operator":"NotEquals","value":{"Choice":"irrevocable"}},"weight":6},{"id":"rev-003","category":"Revocation","title":"When does revocation take effect?","description":"Determine the effective date of license revocation after proper notice has been given.","tooltip":"The effective date of revocation affects when licensees must cease using the software.","help_text":"A reasonable waiting period allows licensees to transition to alternative solutions.","recommended_answer":{"Choice":"30_days_notice"},"legal_implications":"Immediate revocation may be unenforceable if it causes significant harm to the licensee.","question_type":"Choice","options":[{"label":"Immediately upon notice","value":"immediate","description":"Revocation is effective as soon as notice is given"},{"label":"30 days after notice","value":"30_days_notice","description":"Revocation takes effect 30 days after notice"},{"label":"60 days after notice","value":"60_days_notice","description":"Revocation takes effect 60 days after notice"}],"visible_if":{"question_id":"rev-001","operator":"NotEquals","value":{"Choice":"irrevocable"}},"weight":6},{"id":"rev-004","category":"Revocation","title":"Is there an appeal process for revocation?","description":"Determine whether licensees have the right to appeal or challenge a license revocation decision.","tooltip":"An appeal process provides a mechanism for licensees to contest wrongful revocation.","help_text":"Consider whether the appeal is informal (direct negotiation) or formal (arbitration, mediation).","recommended_answer":{"Boolean":true},"legal_implications":"Lack of an appeal process may reduce the perceived fairness of the license and deter adoption.","question_type":"Boolean","options":[],"visible_if":{"question_id":"rev-001","operator":"NotEquals","value":{"Choice":"irrevocable"}},"weight":5},{"id":"exp-001","category":"Expiration","title":"Does the license have a fixed expiration date?","description":"Determine whether the license expires after a certain period or remains in effect indefinitely.","tooltip":"License expiration requires periodic renewal and review of license terms.","help_text":"Perpetual licenses are common in open-source; time-limited licenses are common in commercial software.","recommended_answer":{"Boolean":false},"legal_implications":"Expiration introduces uncertainty for licensees who build long-term dependencies on the software.","question_type":"Boolean","options":[],"visible_if":null,"weight":7},{"id":"exp-002","category":"Expiration","title":"What is the license duration?","description":"Specify the length of time for which the license remains in effect before it expires or must be renewed.","tooltip":"License duration defines the commitment period for both the licensor and licensee.","help_text":"Consider whether the duration should be measured in months, years, or be tied to specific milestones.","recommended_answer":{"Choice":"perpetual"},"legal_implications":"Short license durations can create uncertainty; very long durations may lock parties into unfavorable terms.","question_type":"Choice","options":[{"label":"Perpetual","value":"perpetual","description":"License never expires"},{"label":"1 year","value":"1_year","description":"License valid for one year"},{"label":"3 years","value":"3_years","description":"License valid for three years"},{"label":"5 years","value":"5_years","description":"License valid for five years"}],"visible_if":{"question_id":"exp-001","operator":"Equals","value":{"Boolean":true}},"weight":7},{"id":"exp-003","category":"Expiration","title":"What are the renewal requirements?","description":"Specify the process and requirements for renewing the license when it expires.","tooltip":"Renewal requirements ensure that both parties can update terms as the software evolves.","help_text":"Consider whether renewal is automatic, requires payment, or involves re-negotiation of terms.","recommended_answer":{"Text":"License may be renewed by mutual written agreement of both parties."},"legal_implications":"Unclear renewal terms can lead to inadvertent license expiration and loss of usage rights.","question_type":"Text","options":[],"visible_if":{"question_id":"exp-001","operator":"Equals","value":{"Boolean":true}},"weight":6},{"id":"exp-004","category":"Expiration","title":"Must expiration be notified to licensees?","description":"Determine whether the licensor must notify licensees before the license expires.","tooltip":"Expiration notifications prevent licensees from unknowingly continuing to use expired software.","help_text":"Consider whether notification should be provided 30, 60, or 90 days before expiration.","recommended_answer":{"Boolean":true},"legal_implications":"Failure to notify of expiration may be considered bad faith and could affect enforcement of expired terms.","question_type":"Boolean","options":[],"visible_if":{"question_id":"exp-001","operator":"Equals","value":{"Boolean":true}},"weight":5},{"id":"jur-001","category":"Jurisdiction","title":"Which jurisdiction governs this license?","description":"Choose the legal jurisdiction whose laws will govern the interpretation and enforcement of this license.","tooltip":"Governing jurisdiction determines which country's or state's laws apply to license disputes.","help_text":"Choose a jurisdiction that is neutral and well-understood for software licensing purposes.","recommended_answer":{"Choice":"delaware_usa"},"legal_implications":"The governing jurisdiction significantly affects how the license terms will be interpreted and enforced.","question_type":"Choice","options":[{"label":"State of Delaware, USA","value":"delaware_usa","description":"Common choice for US-based software licenses"},{"label":"State of California, USA","value":"california_usa","description":"California law, well-established for technology disputes"},{"label":"England and Wales","value":"england_wales","description":"English law, widely used internationally"},{"label":"Germany","value":"germany","description":"German law, strong IP protection"}],"visible_if":null,"weight":8},{"id":"jur-002","category":"Jurisdiction","title":"What dispute resolution method applies?","description":"Choose the method for resolving disputes arising from the license.","tooltip":"Dispute resolution mechanisms determine how conflicts between licensor and licensee are handled.","help_text":"Consider whether negotiation, mediation, arbitration, or litigation is the preferred method.","recommended_answer":{"Choice":"negotiation_then_litigation"},"legal_implications":"The dispute resolution method affects the cost, speed, and finality of dispute resolution.","question_type":"Choice","options":[{"label":"Negotiation then litigation","value":"negotiation_then_litigation","description":"Attempt negotiation first, then proceed to court if unsuccessful"},{"label":"Binding arbitration","value":"arbitration","description":"All disputes resolved through binding arbitration"},{"label":"Mediation then arbitration","value":"mediation_arbitration","description":"Attempt mediation first, then arbitration if unsuccessful"},{"label":"Litigation only","value":"litigation","description":"Disputes resolved through court proceedings"}],"visible_if":null,"weight":7},{"id":"jur-003","category":"Jurisdiction","title":"Is arbitration mandatory for disputes?","description":"Determine whether parties must submit to arbitration rather than pursuing court litigation.","tooltip":"Mandatory arbitration can be faster and less expensive than litigation but limits appeal rights.","help_text":"Consider whether arbitration should be optional or mandatory for different types of disputes.","recommended_answer":{"Boolean":false},"legal_implications":"Mandatory arbitration clauses may be unenforceable in some jurisdictions or for certain types of claims.","question_type":"Boolean","options":[],"visible_if":{"question_id":"jur-002","operator":"Equals","value":{"Choice":"arbitration"}},"weight":6},{"id":"jur-004","category":"Jurisdiction","title":"What is the governing law selection?","description":"Specify the exact body of law that applies to the license, including any applicable statutes or codes.","tooltip":"Precise governing law selection avoids ambiguity about which legal rules apply to the license.","help_text":"Consider referencing specific legal codes (e.g., UCC, Copyright Act) that should govern the license.","recommended_answer":{"Text":"The laws of the State of Delaware, United States of America, without regard to conflict of law principles."},"legal_implications":"Overly broad governing law selections may be interpreted differently in different courts.","question_type":"Text","options":[],"visible_if":null,"weight":6},{"id":"ec-001","category":"ExportControl","title":"Are there export restrictions on this software?","description":"Determine whether the software is subject to export control regulations that restrict distribution to certain countries or entities.","tooltip":"Export control compliance is required by law for software that contains encryption or is classified as defense-related.","help_text":"Consider EAR (US), dual-use regulations (EU), and other applicable export control regimes.","recommended_answer":{"Boolean":false},"legal_implications":"Failure to comply with export control regulations can result in severe criminal and civil penalties.","question_type":"Boolean","options":[],"visible_if":null,"weight":8},{"id":"ec-002","category":"ExportControl","title":"What is the export control classification?","description":"Specify the export control classification of the software, if applicable.","tooltip":"Export control classification determines which regulations apply and what licenses or exemptions are available.","help_text":"Common classifications include EAR99, ECCN 5D002 (encryption), and Wassenaar Arrangement categories.","recommended_answer":{"Choice":"ear99"},"legal_implications":"Incorrect classification can result in violations of export control laws with serious legal consequences.","question_type":"Choice","options":[{"label":"EAR99 (no classification)","value":"ear99","description":"Software not subject to specific export controls"},{"label":"ECCN 5D002 (encryption)","value":"eccn_5d002","description":"Software containing encryption technology"},{"label":"Wassenaar dual-use","value":"wassenaar","description":"Software classified under Wassenaar dual-use regulations"},{"label":"USML (military)","value":"usml","description":"Software classified as defense article under USML"}],"visible_if":{"question_id":"ec-001","operator":"Equals","value":{"Boolean":true}},"weight":7},{"id":"ec-003","category":"ExportControl","title":"Which countries are subject to export restrictions?","description":"Specify the countries or regions to which export of the software is prohibited or restricted.","tooltip":"Country-specific restrictions are required by various export control regimes and sanctions programs.","help_text":"Consider OFAC sanctions, EU restrictive measures, and UN sanctions when defining restricted countries.","recommended_answer":{"Text":"OFAC-sanctioned countries as listed in 31 CFR Part 500 et seq."},"legal_implications":"Exporting to restricted countries can result in criminal prosecution and substantial fines.","question_type":"Text","options":[],"visible_if":{"question_id":"ec-001","operator":"Equals","value":{"Boolean":true}},"weight":7},{"id":"ec-004","category":"ExportControl","title":"What export compliance requirements apply?","description":"Select the compliance requirements that must be met when exporting the software across borders.","tooltip":"Export compliance requirements help ensure that the software is not distributed in violation of applicable laws.","help_text":"Consider whether end-user certificates, license applications, or self-classifications are required.","recommended_answer":{"MultiChoice":["self_classification"]},"legal_implications":"Non-compliance with export requirements can result in loss of export privileges and criminal liability.","question_type":"MultiChoice","options":[{"label":"Self-classification required","value":"self_classification","description":"Exporters must self-classify the software under applicable regulations"},{"label":"End-user certificates required","value":"end_user_cert","description":"Must obtain end-user certificates for exports"},{"label":"Export license required","value":"export_license","description":"Must obtain specific export licenses from government authorities"},{"label":"No export compliance requirements","value":"none","description":"No specific export compliance obligations"}],"visible_if":{"question_id":"ec-001","operator":"Equals","value":{"Boolean":true}},"weight":6},{"id":"crypt-001","category":"Cryptography","title":"Does the software use cryptographic algorithms?","description":"Determine whether the software implements or utilizes any cryptographic algorithms, protocols, or libraries.","tooltip":"Cryptographic usage can trigger export control regulations and compliance requirements.","help_text":"Consider whether the software uses encryption for data protection, authentication, or digital signatures.","recommended_answer":{"Boolean":false},"legal_implications":"Software containing encryption may be subject to export restrictions under EAR and similar regulations.","question_type":"Boolean","options":[],"visible_if":null,"weight":7},{"id":"crypt-002","category":"Cryptography","title":"Are there restrictions on which cryptographic algorithms can be used?","description":"Specify whether the software is restricted to certain cryptographic algorithms or standards.","tooltip":"Algorithm restrictions can ensure compliance with government standards (FIPS, Common Criteria) and security best practices.","help_text":"Consider restricting to NIST-approved algorithms for government use or allowing any algorithm for general use.","recommended_answer":{"MultiChoice":["any_algorithm"]},"legal_implications":"Algorithm restrictions must balance security requirements with the flexibility needed by the developer community.","question_type":"MultiChoice","options":[{"label":"Any algorithm permitted","value":"any_algorithm","description":"No restrictions on cryptographic algorithm selection"},{"label":"FIPS-approved only","value":"fips","description":"Only FIPS 140-2/140-3 validated algorithms permitted"},{"label":"NIST-approved only","value":"nist","description":"Only algorithms recommended by NIST permitted"},{"label":"No cryptography","value":"no_cryptography","description":"Software must not use any cryptographic algorithms"}],"visible_if":{"question_id":"crypt-001","operator":"Equals","value":{"Boolean":true}},"weight":6},{"id":"crypt-003","category":"Cryptography","title":"Are export restrictions applicable due to cryptographic usage?","description":"Determine whether the use of cryptography in the software triggers additional export control restrictions.","tooltip":"Many countries restrict the export of software containing strong encryption technology.","help_text":"Consider whether encryption module classification is needed under applicable export regulations.","recommended_answer":{"Boolean":false},"legal_implications":"Failure to comply with cryptographic export restrictions can result in severe penalties.","question_type":"Boolean","options":[],"visible_if":{"question_id":"crypt-001","operator":"Equals","value":{"Boolean":true}},"weight":7},{"id":"crypt-004","category":"Cryptography","title":"What cryptographic usage license applies?","description":"Choose the licensing terms that apply to the cryptographic components of the software.","tooltip":"Cryptographic components may be licensed differently from the rest of the software due to regulatory requirements.","help_text":"Some jurisdictions have special licensing requirements for cryptographic software.","recommended_answer":{"Choice":"same_license"},"legal_implications":"Separate cryptographic licensing may be required in jurisdictions with cryptographic software regulations.","question_type":"Choice","options":[{"label":"Same license as main software","value":"same_license","description":"Cryptographic components use the same license"},{"label":"Special cryptographic license","value":"special","description":"A separate license applies to cryptographic components"},{"label":"Public domain","value":"public_domain","description":"Cryptographic components are in the public domain"}],"visible_if":{"question_id":"crypt-001","operator":"Equals","value":{"Boolean":true}},"weight":5},{"id":"wm-001","category":"Watermarking","title":"Is watermarking of outputs required?","description":"Determine whether outputs, documents, or products created using this software must include visible or invisible watermarks.","tooltip":"Watermarking helps trace the origin and usage of outputs generated by the software.","help_text":"Consider whether watermarks should be visible to users or embedded invisibly in the data.","recommended_answer":{"Boolean":false},"legal_implications":"Mandatory watermarking requirements may limit the software's use in creative and publishing workflows.","question_type":"Boolean","options":[],"visible_if":null,"weight":5},{"id":"wm-002","category":"Watermarking","title":"Is watermark removal prohibited?","description":"Determine whether removing or altering watermarks placed by this software is prohibited under the license.","tooltip":"Watermark removal prohibition helps maintain the integrity of attribution and usage tracking.","help_text":"Consider whether watermark removal should be a license violation or simply discouraged.","recommended_answer":{"Boolean":true},"legal_implications":"Watermark removal provisions must be enforceable and not interfere with legitimate use of outputs.","question_type":"Boolean","options":[],"visible_if":{"question_id":"wm-001","operator":"Equals","value":{"Boolean":true}},"weight":5},{"id":"wm-003","category":"Watermarking","title":"What watermarking standards should be used?","description":"Specify the watermarking standards or technologies that must be used when watermarking is required.","tooltip":"Standardized watermarking ensures consistency and interoperability across different tools and workflows.","help_text":"Consider industry standards like C2PA, IPTC, or custom watermarking formats.","recommended_answer":{"Choice":"c2pa"},"legal_implications":"Proprietary watermarking standards can create vendor lock-in and interoperability issues.","question_type":"Choice","options":[{"label":"C2PA standard","value":"c2pa","description":"Use the Coalition for Content Provenance and Authenticity standard"},{"label":"IPTC standard","value":"iptc","description":"Use IPTC metadata standards for watermarking"},{"label":"Custom watermarking","value":"custom","description":"Use a custom watermarking format defined by the licensor"},{"label":"Any standard permitted","value":"any","description":"Any watermarking standard or technology is acceptable"}],"visible_if":{"question_id":"wm-001","operator":"Equals","value":{"Boolean":true}},"weight":4},{"id":"wm-004","category":"Watermarking","title":"Is watermark detection required?","description":"Determine whether the software or its users must be able to detect watermarks placed by the software or other tools.","tooltip":"Detection requirements ensure that watermarks can be verified for authenticity and integrity.","help_text":"Consider whether detection should be automated or manual, and whether false positives should be handled.","recommended_answer":{"Boolean":false},"legal_implications":"Detection requirements may add complexity and cost to the software's implementation and maintenance.","question_type":"Boolean","options":[],"visible_if":{"question_id":"wm-001","operator":"Equals","value":{"Boolean":true}},"weight":4},{"id":"drm-001","category":"Drm","title":"Can DRM be applied to the software?","description":"Determine whether licensees are permitted to apply digital rights management (DRM) technology to the software or its derivatives.","tooltip":"DRM restrictions affect how the software can be protected from unauthorized copying or use.","help_text":"Some open-source licenses (like GPLv3) restrict the use of DRM to prevent tivoization.","recommended_answer":{"Boolean":true},"legal_implications":"DRM restrictions can conflict with anti-circumvention laws and user freedom principles.","question_type":"Boolean","options":[],"visible_if":null,"weight":6},{"id":"drm-002","category":"Drm","title":"Is DRM circumvention prohibited?","description":"Determine whether circumventing DRM applied to the software is prohibited under the license terms.","tooltip":"DRM circumvention provisions interact with laws like the DMCA (US) and similar regulations worldwide.","help_text":"Consider whether users have the right to circumvent DRM for interoperability, accessibility, or other purposes.","recommended_answer":{"Boolean":false},"legal_implications":"Prohibiting DRM circumvention may conflict with statutory exceptions for accessibility and interoperability.","question_type":"Boolean","options":[],"visible_if":null,"weight":6},{"id":"drm-003","category":"Drm","title":"Are there DRM technology restrictions?","description":"Select the restrictions on what types of DRM technology can be applied to the software.","tooltip":"Technology restrictions ensure that DRM methods used are appropriate and don't harm user rights.","help_text":"Consider whether to restrict to specific DRM standards or prohibit DRM entirely.","recommended_answer":{"MultiChoice":["no_hardware_drm"]},"legal_implications":"DRM technology restrictions must balance content protection with user freedom and interoperability.","question_type":"MultiChoice","options":[{"label":"No hardware-based DRM","value":"no_hardware_drm","description":"Cannot use DRM tied to specific hardware"},{"label":"Open DRM standards only","value":"open_standards","description":"DRM must use open, interoperable standards"},{"label":"No DRM at all","value":"no_drm","description":"DRM is completely prohibited"},{"label":"Any DRM permitted","value":"any","description":"No restrictions on DRM technology"}],"visible_if":{"question_id":"drm-001","operator":"Equals","value":{"Boolean":true}},"weight":5},{"id":"drm-004","category":"Drm","title":"What are the user rights regarding DRM?","description":"Specify what rights users have regarding DRM applied to the software by the licensor or downstream parties.","tooltip":"User DRM rights determine whether users can access, modify, and use the software without DRM restrictions.","help_text":"Consider providing exceptions for accessibility, interoperability, and reverse engineering for security.","recommended_answer":{"Choice":"full_rights"},"legal_implications":"User DRM rights must comply with applicable anti-circumvention laws while protecting user freedom.","question_type":"Choice","options":[{"label":"Full user rights","value":"full_rights","description":"Users have unrestricted rights to use, modify, and distribute"},{"label":"Rights with exceptions","value":"with_exceptions","description":"Rights are limited in specific cases (e.g., DRM-protected content)"},{"label":"Limited rights","value":"limited","description":"User rights are restricted by DRM requirements"}],"visible_if":null,"weight":5},{"id":"dw-001","category":"DerivativeWorks","title":"Are derivative works of the software allowed?","description":"Determine whether licensees can create derivative works that incorporate or modify the original software.","tooltip":"Derivative works include modifications, extensions, adaptations, and works that incorporate substantial portions of the original.","help_text":"This is distinct from modification rights; derivative works may include works that combine the software with other code.","recommended_answer":{"Boolean":true},"legal_implications":"Restricting derivative works may conflict with fair use rights and the principles of open-source software.","question_type":"Boolean","options":[],"visible_if":null,"weight":9},{"id":"dw-002","category":"DerivativeWorks","title":"What license must derivative works use?","description":"Choose the licensing terms that apply to derivative works created from the original software.","tooltip":"License propagation requirements determine how license obligations flow to derivative works.","help_text":"Consider whether derivative works must use the same license, a compatible license, or any license.","recommended_answer":{"Choice":"same_license"},"legal_implications":"Incompatible license requirements can prevent the software from being combined with other projects.","question_type":"Choice","options":[{"label":"Same license (share-alike)","value":"same_license","description":"Derivative works must be licensed under the same terms"},{"label":"Compatible license","value":"compatible","description":"Derivative works can use any OSI-approved compatible license"},{"label":"Any license","value":"any","description":"Derivative works can be licensed under any terms"},{"label":"Creator's choice","value":"creators_choice","description":"Derivative work creator chooses the license"}],"visible_if":{"question_id":"dw-001","operator":"Equals","value":{"Boolean":true}},"weight":8},{"id":"dw-003","category":"DerivativeWorks","title":"Is attribution required for derivative works?","description":"Determine whether derivative works must include attribution to the original software and its authors.","tooltip":"Attribution in derivative works ensures that original contributors receive credit for their work.","help_text":"Consider whether attribution must follow a specific format or can be included in any reasonable way.","recommended_answer":{"Boolean":true},"legal_implications":"Lack of attribution requirements can result in derivative works that mislead users about their origin.","question_type":"Boolean","options":[],"visible_if":{"question_id":"dw-001","operator":"Equals","value":{"Boolean":true}},"weight":7},{"id":"dw-004","category":"DerivativeWorks","title":"What constitutes a 'substantial modification' for derivative work classification?","description":"Define the threshold at which modifications to the software constitute a derivative work rather than an independent work.","tooltip":"The substantial modification threshold determines when copyleft or share-alike obligations are triggered.","help_text":"Consider percentage thresholds, functional dependency tests, or integration depth as criteria.","recommended_answer":{"Text":"A derivative work is any work that incorporates, modifies, or extends the software's core functionality, APIs, or data structures."},"legal_implications":"Unclear derivative work thresholds lead to widespread non-compliance and legal uncertainty in the community.","question_type":"Text","options":[],"visible_if":{"question_id":"dw-001","operator":"Equals","value":{"Boolean":true}},"weight":7},{"id":"fork-001","category":"Forks","title":"Is forking of the software permitted?","description":"Determine whether licensees can create and distribute forks (independent copies with modifications) of the software.","tooltip":"Forking is a fundamental right in open-source software that allows the community to take the project in new directions.","help_text":"Most open-source licenses implicitly allow forking; making it explicit clarifies the project's stance on forks.","recommended_answer":{"Boolean":true},"legal_implications":"Restricting forking is fundamentally incompatible with the open-source definition and community expectations.","question_type":"Boolean","options":[],"visible_if":null,"weight":8},{"id":"fork-002","category":"Forks","title":"Are there naming requirements for forks?","description":"Specify whether forks must use a different name to distinguish them from the original project.","tooltip":"Naming requirements prevent confusion between the original project and its forks, protecting the original brand.","help_text":"Consider whether the fork must include a suffix, prefix, or entirely different name.","recommended_answer":{"Choice":"different_name"},"legal_implications":"Forks using confusingly similar names may violate trademark law and mislead users.","question_type":"Choice","options":[{"label":"Must use different name","value":"different_name","description":"Forks must have a name clearly distinct from the original"},{"label":"Must indicate fork status","value":"indicate","description":"Forks must clearly indicate they are forks of the original"},{"label":"No naming restrictions","value":"none","description":"Forks can use any name they choose"}],"visible_if":{"question_id":"fork-001","operator":"Equals","value":{"Boolean":true}},"weight":6},{"id":"fork-003","category":"Forks","title":"Must fork creators notify the original project?","description":"Determine whether fork creators must notify the original project's maintainers or community about the fork.","tooltip":"Fork notification helps the original project track its ecosystem and potentially merge improvements.","help_text":"Notification can be as simple as a GitHub fork or a formal announcement to the project community.","recommended_answer":{"Boolean":false},"legal_implications":"Mandatory notification requirements may discourage legitimate forking for competitive or philosophical reasons.","question_type":"Boolean","options":[],"visible_if":{"question_id":"fork-001","operator":"Equals","value":{"Boolean":true}},"weight":4},{"id":"fork-004","category":"Forks","title":"Should forks contribute improvements back to the original project?","description":"Determine whether fork creators are expected or required to contribute improvements back to the upstream project.","tooltip":"Upstream contribution expectations help maintain a healthy ecosystem where improvements benefit the entire community.","help_text":"Consider whether contribution is mandatory, encouraged, or optional for fork creators.","recommended_answer":{"Boolean":false},"legal_implications":"Mandatory contribution requirements may conflict with the rights of fork creators and deter fork creation.","question_type":"Boolean","options":[],"visible_if":{"question_id":"fork-001","operator":"Equals","value":{"Boolean":true}},"weight":4},{"id":"contrib-001","category":"Contributions","title":"Are external contributions to the software accepted?","description":"Determine whether the project accepts code contributions from external developers who are not part of the core team.","tooltip":"Open contribution models encourage community participation and can accelerate software development.","help_text":"Consider whether contributions are accepted from anyone, only from registered contributors, or only by invitation.","recommended_answer":{"Boolean":true},"legal_implications":"Accepting contributions creates complex intellectual property questions about the provenance of contributed code.","question_type":"Boolean","options":[],"visible_if":null,"weight":7},{"id":"contrib-002","category":"Contributions","title":"What licensing terms apply to contributions?","description":"Choose the license terms under which external contributions are made to the project.","tooltip":"Contribution licensing determines the IP terms for code provided by community members.","help_text":"Common models include same-project-license, CLA-based, and developer certificate of origin (DCO).","recommended_answer":{"Choice":"same_license"},"legal_implications":"Unclear contribution licensing can create IP encumbrances and complicate future licensing changes.","question_type":"Choice","options":[{"label":"Same license as project","value":"same_license","description":"Contributions are licensed under the same license as the project"},{"label":"DCO (Developer Certificate of Origin)","value":"dco","description":"Contributors certify they have the right to submit the contribution under the project license"},{"label":"CLA required","value":"cla","description":"Contributors must sign a Contributor License Agreement"},{"label":"Contributor's choice","value":"contributors_choice","description":"Contributors choose the license for their contribution"}],"visible_if":{"question_id":"contrib-001","operator":"Equals","value":{"Boolean":true}},"weight":7},{"id":"contrib-003","category":"Contributions","title":"What is the contribution review process?","description":"Describe the review and approval process that contributions must go through before being merged.","tooltip":"A clear review process ensures code quality and consistency while providing transparency for contributors.","help_text":"Consider code review requirements, testing mandates, and documentation standards for contributions.","recommended_answer":{"Text":"All contributions must pass automated tests, code review by at least one maintainer, and meet project coding standards."},"legal_implications":"Lack of a review process can result in low-quality or legally problematic code being incorporated into the project.","question_type":"Text","options":[],"visible_if":{"question_id":"contrib-001","operator":"Equals","value":{"Boolean":true}},"weight":6},{"id":"contrib-004","category":"Contributions","title":"Do contributors retain rights to their contributions?","description":"Determine whether contributors retain intellectual property rights to the code they contribute, or whether these rights are assigned to the project.","tooltip":"Rights retention allows contributors to use their contributed code in other projects, while assignment centralizes IP control.","help_text":"Rights retention is more common in open-source; assignment is more common in commercial projects.","recommended_answer":{"Boolean":true},"legal_implications":"Contributor rights retention creates a more diverse IP landscape but simplifies community participation.","question_type":"Boolean","options":[],"visible_if":{"question_id":"contrib-001","operator":"Equals","value":{"Boolean":true}},"weight":6},{"id":"pr-001","category":"PullRequests","title":"Are pull requests accepted as a contribution method?","description":"Determine whether the project accepts code contributions through pull requests on platforms like GitHub, GitLab, or Bitbucket.","tooltip":"Pull requests provide a structured workflow for reviewing and integrating community contributions.","help_text":"Consider whether pull requests are the primary contribution method or if other methods are also accepted.","recommended_answer":{"Boolean":true},"legal_implications":"Pull request workflows create a record of contributions and their review, which is valuable for IP provenance tracking.","question_type":"Boolean","options":[],"visible_if":null,"weight":6},{"id":"pr-002","category":"PullRequests","title":"What review requirements apply to pull requests?","description":"Select the requirements that must be met before a pull request can be merged into the main codebase.","tooltip":"Review requirements maintain code quality, security, and consistency across the project.","help_text":"Consider code review, automated testing, documentation updates, and sign-off requirements.","recommended_answer":{"MultiChoice":["code_review","tests_pass"]},"legal_implications":"Inadequate review processes can result in security vulnerabilities and legal issues being introduced into the codebase.","question_type":"MultiChoice","options":[{"label":"Code review required","value":"code_review","description":"At least one maintainer must review and approve the code"},{"label":"Automated tests must pass","value":"tests_pass","description":"All CI/CD tests must pass before merging"},{"label":"Documentation must be updated","value":"docs_updated","description":"Related documentation must be updated with the change"},{"label":"No specific requirements","value":"none","description":"No formal review requirements for merging"}],"visible_if":{"question_id":"pr-001","operator":"Equals","value":{"Boolean":true}},"weight":5},{"id":"pr-003","category":"PullRequests","title":"What are the merge criteria for pull requests?","description":"Select the criteria that must be satisfied before a pull request is merged into the main branch.","tooltip":"Merge criteria define the quality and compliance gates that all contributions must pass.","help_text":"Consider review approvals, test results, build status, and sign-off requirements as merge criteria.","recommended_answer":{"MultiChoice":["review_approved","ci_passing"]},"legal_implications":"Well-defined merge criteria ensure that only vetted and compliant code enters the main codebase.","question_type":"MultiChoice","options":[{"label":"Review approval required","value":"review_approved","description":"At least one approving review from a maintainer"},{"label":"CI must be passing","value":"ci_passing","description":"All continuous integration checks must pass"},{"label":"No merge conflicts","value":"no_conflicts","description":"The branch must be free of merge conflicts"},{"label":"Signed-off-by required","value":"signed_off","description":"Contributor must include a signed-off-by line"}],"visible_if":{"question_id":"pr-001","operator":"Equals","value":{"Boolean":true}},"weight":5},{"id":"pr-004","category":"PullRequests","title":"Who owns the code in merged pull requests?","description":"Determine the ownership and licensing terms for code that is submitted and merged through pull requests.","tooltip":"Pull request ownership affects the IP provenance and licensing of the merged codebase.","help_text":"Consider whether the project, the contributor, or a shared model applies to ownership of merged code.","recommended_answer":{"Choice":"contributor_retains"},"legal_implications":"Clear PR ownership terms prevent disputes about IP rights in contributed code.","question_type":"Choice","options":[{"label":"Contributor retains rights","value":"contributor_retains","description":"Contributor keeps IP rights; project receives license"},{"label":"Assigned to project","value":"assigned_to_project","description":"IP rights are assigned to the project organization"},{"label":"Shared ownership","value":"shared","description":"Both the contributor and project share IP rights"}],"visible_if":{"question_id":"pr-001","operator":"Equals","value":{"Boolean":true}},"weight":5},{"id":"cla-001","category":"ContributorLicenseAgreement","title":"Is a Contributor License Agreement (CLA) required?","description":"Determine whether contributors must sign a CLA before their contributions can be accepted into the project.","tooltip":"A CLA clarifies the IP relationship between contributors and the project, reducing legal ambiguity.","help_text":"Consider whether the CLA is an Individual CLA (ICLA) or Corporate CLA (CCLA), or both.","recommended_answer":{"Boolean":false},"legal_implications":"Requiring a CLA can deter community participation but provides stronger IP protection for the project.","question_type":"Boolean","options":[],"visible_if":{"question_id":"contrib-001","operator":"Equals","value":{"Boolean":true}},"weight":7},{"id":"cla-002","category":"ContributorLicenseAgreement","title":"What are the CLA terms?","description":"Describe the key terms of the Contributor License Agreement that contributors must accept.","tooltip":"CLA terms define the scope of the license grant, IP warranties, and indemnification provisions.","help_text":"Common CLA terms include copyright assignment, patent grants, and warranty provisions.","recommended_answer":{"Text":"Contributors grant a perpetual, irrevocable, worldwide, royalty-free license to use, modify, and distribute their contributions under the project license."},"legal_implications":"CLA terms must be carefully drafted to balance project protection with contributor rights and expectations.","question_type":"Text","options":[],"visible_if":{"question_id":"cla-001","operator":"Equals","value":{"Boolean":true}},"weight":6},{"id":"cla-003","category":"ContributorLicenseAgreement","title":"Must the CLA be signed before a contribution is accepted?","description":"Determine whether the CLA must be signed before the first contribution or if it can be signed at any time before merging.","tooltip":"Timing requirements affect the contributor workflow and the project's legal compliance process.","help_text":"Some projects accept contributions first and require CLA signing only at the time of merge.","recommended_answer":{"Boolean":true},"legal_implications":"Post-hoc CLA signing may create uncertainty about the IP status of contributions already in the codebase.","question_type":"Boolean","options":[],"visible_if":{"question_id":"cla-001","operator":"Equals","value":{"Boolean":true}},"weight":5},{"id":"cla-004","category":"ContributorLicenseAgreement","title":"Does the CLA cover patent rights?","description":"Determine whether the CLA includes a grant of patent rights from the contributor to the project.","tooltip":"Patent grants in CLAs prevent contributors from later suing the project for patent infringement related to their contributions.","help_text":"Patent coverage in CLAs is especially important for projects in patent-sensitive industries.","recommended_answer":{"Boolean":true},"legal_implications":"Without patent coverage in the CLA, contributions could introduce patent infringement risks into the project.","question_type":"Boolean","options":[],"visible_if":{"question_id":"cla-001","operator":"Equals","value":{"Boolean":true}},"weight":6},{"id":"dual-001","category":"DualLicensing","title":"Is dual licensing offered for this software?","description":"Determine whether the software is available under two different licenses, allowing users to choose the most appropriate one.","tooltip":"Dual licensing provides flexibility for users who need different license terms for different use cases.","help_text":"Common dual-license combinations include GPL/commercial, MPL/commercial, and MIT/Apache.","recommended_answer":{"Boolean":false},"legal_implications":"Dual licensing requires all copyright holders to agree to offer both license options.","question_type":"Boolean","options":[],"visible_if":null,"weight":7},{"id":"dual-002","category":"DualLicensing","title":"What is the second license option?","description":"Specify the alternative license that users can choose instead of the primary license.","tooltip":"The second license option typically provides different rights or obligations than the primary license.","help_text":"Consider whether the second license is more permissive (for proprietary use) or more restrictive (for stronger copyleft).","recommended_answer":{"Text":"Commercial license available upon request from the copyright holder."},"legal_implications":"Both license options must be clearly defined and consistently offered to avoid confusion and disputes.","question_type":"Text","options":[],"visible_if":{"question_id":"dual-001","operator":"Equals","value":{"Boolean":true}},"weight":6},{"id":"dual-003","category":"DualLicensing","title":"Under what conditions can users choose between the two licenses?","description":"Specify the criteria or conditions that determine which license option a user can select.","tooltip":"License choice conditions define who is eligible for each license option and under what circumstances.","help_text":"Consider whether the choice is based on usage type, organization size, or commercial status.","recommended_answer":{"MultiChoice":["user_choice"]},"legal_implications":"License choice conditions must be clearly communicated and consistently applied to prevent misuse.","question_type":"MultiChoice","options":[{"label":"User's choice","value":"user_choice","description":"Users can choose either license at any time"},{"label":"Non-commercial use","value":"non_commercial","description":"GPL license for non-commercial use, commercial license for commercial use"},{"label":"Open-source use only","value":"open_source","description":"GPL for open-source projects, commercial for proprietary projects"},{"label":"By organization type","value":"org_type","description":"License choice depends on organization type (commercial, academic, nonprofit)"}],"visible_if":{"question_id":"dual-001","operator":"Equals","value":{"Boolean":true}},"weight":6},{"id":"dual-004","category":"DualLicensing","title":"How can users switch between the two licenses?","description":"Specify the process and conditions for switching from one license option to the other.","tooltip":"License switch mechanisms determine how users can change their license choice over time.","help_text":"Consider whether license switching is allowed, prohibited, or subject to conditions.","recommended_answer":{"Text":"Users can switch licenses at any time by notifying the licensor in writing."},"legal_implications":"License switching terms must account for the different obligations under each license option.","question_type":"Text","options":[],"visible_if":{"question_id":"dual-001","operator":"Equals","value":{"Boolean":true}},"weight":5},{"id":"roy-001","category":"Royalty","title":"Are royalties required for use of this software?","description":"Determine whether licensees must pay royalties (ongoing payments based on usage or revenue) for using the software.","tooltip":"Royalty-based licensing creates a recurring revenue stream for the licensor based on the software's commercial success.","help_text":"Royalties are common in commercial software licenses but rare in open-source licenses.","recommended_answer":{"Choice":"no_royalty"},"legal_implications":"Royalty requirements must be clearly defined with verifiable metrics to prevent disputes.","question_type":"Choice","options":[{"label":"No royalties required","value":"no_royalty","description":"Software is provided without royalty obligations"},{"label":"Revenue-based royalty","value":"revenue_based","description":"Royalty calculated as a percentage of revenue generated using the software"},{"label":"Usage-based royalty","value":"usage_based","description":"Royalty calculated based on usage metrics (users, API calls, etc.)"},{"label":"Per-unit royalty","value":"per_unit","description":"Royalty paid per unit of software distributed or deployed"}],"visible_if":null,"weight":7},{"id":"roy-002","category":"Royalty","title":"What is the royalty rate?","description":"Specify the percentage or fixed amount that constitutes the royalty payment for using the software.","tooltip":"The royalty rate determines the ongoing cost of using the software for commercial purposes.","help_text":"Consider industry standards, competitive positioning, and the value provided by the software when setting rates.","recommended_answer":{"Number":0},"legal_implications":"Royalty rates must be competitive and reasonable to avoid deterring adoption while still generating revenue.","question_type":"Number","options":[],"visible_if":{"question_id":"roy-001","operator":"NotEquals","value":{"Choice":"no_royalty"}},"weight":7},{"id":"roy-003","category":"Royalty","title":"What is the royalty payment schedule?","description":"Choose the frequency and timing of royalty payments.","tooltip":"Payment schedule affects cash flow management for both the licensor and licensee.","help_text":"Consider monthly, quarterly, or annual payment schedules, and whether there are advance payments.","recommended_answer":{"Choice":"quarterly"},"legal_implications":"Payment schedule terms must be practical and enforceable to ensure consistent royalty collection.","question_type":"Choice","options":[{"label":"Monthly payments","value":"monthly","description":"Royalties paid monthly in arrears"},{"label":"Quarterly payments","value":"quarterly","description":"Royalties paid quarterly in arrears"},{"label":"Annual payments","value":"annual","description":"Royalties paid annually in arrears"},{"label":"One-time payment","value":"one_time","description":"Single upfront payment instead of ongoing royalties"}],"visible_if":{"question_id":"roy-001","operator":"NotEquals","value":{"Choice":"no_royalty"}},"weight":6},{"id":"roy-004","category":"Royalty","title":"What royalty reporting requirements apply?","description":"Specify the reporting obligations that licensees must fulfill regarding their royalty calculations and payments.","tooltip":"Reporting requirements help the licensor verify accurate royalty calculations and payments.","help_text":"Consider what metrics must be reported, how often, and in what format.","recommended_answer":{"Text":"Licensees must submit quarterly reports detailing revenue generated, units deployed, or other applicable metrics used to calculate royalties."},"legal_implications":"Reporting requirements must balance the licensor's need for verification with the licensee's administrative burden.","question_type":"Text","options":[],"visible_if":{"question_id":"roy-001","operator":"NotEquals","value":{"Choice":"no_royalty"}},"weight":5},{"id":"sub-001","category":"Subscription","title":"Is this a subscription-based license?","description":"Determine whether the software is licensed on a subscription basis, requiring periodic payments for continued use.","tooltip":"Subscription licensing creates recurring revenue and ensures ongoing access to updates and support.","help_text":"Consider whether subscription is the primary licensing model or an alternative to perpetual licensing.","recommended_answer":{"Boolean":false},"legal_implications":"Subscription terms must clearly define what happens to usage rights if the subscription lapses or is cancelled.","question_type":"Boolean","options":[],"visible_if":null,"weight":7},{"id":"sub-002","category":"Subscription","title":"What is the subscription period?","description":"Choose the length of each subscription term for the software license.","tooltip":"Subscription period determines how often the subscription must be renewed and pricing is recalculated.","help_text":"Monthly subscriptions provide flexibility; annual subscriptions provide cost savings and stability.","recommended_answer":{"Choice":"annual"},"legal_implications":"Subscription period terms must be clearly defined to prevent ambiguity about renewal dates and payment obligations.","question_type":"Choice","options":[{"label":"Monthly","value":"monthly","description":"Subscription renews monthly"},{"label":"Quarterly","value":"quarterly","description":"Subscription renews every 3 months"},{"label":"Annual","value":"annual","description":"Subscription renews annually"},{"label":"Multi-year","value":"multi_year","description":"Subscription for 2 or more years at a time"}],"visible_if":{"question_id":"sub-001","operator":"Equals","value":{"Boolean":true}},"weight":6},{"id":"sub-003","category":"Subscription","title":"What are the subscription renewal terms?","description":"Specify the terms and conditions for renewing the subscription at the end of each term.","tooltip":"Renewal terms determine whether the subscription renews automatically or requires explicit action.","help_text":"Consider auto-renewal, notice periods, and pricing changes upon renewal.","recommended_answer":{"Text":"Subscription renews automatically at the end of each term unless cancelled with 30 days notice prior to renewal date."},"legal_implications":"Auto-renewal terms must comply with applicable consumer protection laws and clearly disclose renewal terms.","question_type":"Text","options":[],"visible_if":{"question_id":"sub-001","operator":"Equals","value":{"Boolean":true}},"weight":6},{"id":"sub-004","category":"Subscription","title":"What is the subscription cancellation policy?","description":"Specify the terms and conditions for cancelling a subscription before the end of the current term.","tooltip":"Cancellation terms determine whether users receive refunds and what happens to their data after cancellation.","help_text":"Consider refund policies, data retention periods, and transition support for cancelled subscribers.","recommended_answer":{"Text":"Users may cancel at any time; no refunds for partial periods; data retained for 30 days after cancellation for export."},"legal_implications":"Cancellation terms must comply with consumer protection laws and provide reasonable transition periods for users.","question_type":"Text","options":[],"visible_if":{"question_id":"sub-001","operator":"Equals","value":{"Boolean":true}},"weight":5},{"id":"seat-001","category":"PerSeat","title":"Is per-seat licensing used for this software?","description":"Determine whether the license is priced based on the number of individual users (seats) who can access the software.","tooltip":"Per-seat licensing charges based on the number of authorized users, regardless of how often they use the software.","help_text":"Per-seat licensing is common for desktop applications and collaboration tools.","recommended_answer":{"Boolean":false},"legal_implications":"Per-seat licensing requires clear definitions of what constitutes a 'seat' and mechanisms for counting usage.","question_type":"Boolean","options":[],"visible_if":null,"weight":6},{"id":"seat-002","category":"PerSeat","title":"What is the maximum number of seats?","description":"Specify the maximum number of authorized users (seats) that can access the software under the license.","tooltip":"Seat limits help control costs and ensure compliance with licensing terms.","help_text":"Consider whether to offer unlimited seats or tiered pricing based on seat count.","recommended_answer":{"Number":0},"legal_implications":"Exceeding seat limits without authorization constitutes a license violation and may result in penalties.","question_type":"Number","options":[],"visible_if":{"question_id":"seat-001","operator":"Equals","value":{"Boolean":true}},"weight":6},{"id":"seat-003","category":"PerSeat","title":"Is seat sharing allowed between users?","description":"Determine whether multiple users can share the same seat license (e.g., different shifts using the same login).","tooltip":"Seat sharing policies affect the actual number of users who can access the software versus the number of seats licensed.","help_text":"Consider whether concurrent user limits or named user limits apply to seat licenses.","recommended_answer":{"Boolean":false},"legal_implications":"Ambiguous seat sharing terms can lead to license violations and revenue loss for the licensor.","question_type":"Boolean","options":[],"visible_if":{"question_id":"seat-001","operator":"Equals","value":{"Boolean":true}},"weight":5},{"id":"seat-004","category":"PerSeat","title":"Are seat audits required?","description":"Determine whether the licensor has the right to audit the number of seats being used to verify compliance.","tooltip":"Seat audits help ensure that organizations are using the software within their licensed seat limits.","help_text":"Consider audit frequency, notice requirements, and remediation procedures for seat count discrepancies.","recommended_answer":{"Boolean":true},"legal_implications":"Audit rights must be balanced with reasonable notice requirements to avoid disrupting the licensee's operations.","question_type":"Boolean","options":[],"visible_if":{"question_id":"seat-001","operator":"Equals","value":{"Boolean":true}},"weight":5},{"id":"user-001","category":"PerUser","title":"Is per-user licensing used for this software?","description":"Determine whether the license is priced based on the total number of users who are authorized to use the software, regardless of whether they are actively using it at any given time.","tooltip":"Per-user licensing counts all authorized users, not just concurrent users, which affects pricing and compliance.","help_text":"Per-user licensing is common for enterprise software where all employees may need access at some point.","recommended_answer":{"Boolean":false},"legal_implications":"Per-user licensing requires mechanisms to track and enforce user authorization limits.","question_type":"Boolean","options":[],"visible_if":null,"weight":6},{"id":"user-002","category":"PerUser","title":"What is the maximum number of users?","description":"Specify the maximum number of users authorized to access the software under the license.","tooltip":"User limits define the scope of the license and help control costs for the licensee.","help_text":"Consider whether to offer tiered pricing or unlimited user licenses for different organization sizes.","recommended_answer":{"Number":0},"legal_implications":"Exceeding user limits without authorization constitutes a license violation.","question_type":"Number","options":[],"visible_if":{"question_id":"user-001","operator":"Equals","value":{"Boolean":true}},"weight":6},{"id":"user-003","category":"PerUser","title":"Are there user type restrictions?","description":"Select the types of users that are counted toward the user limit or have specific access requirements.","tooltip":"User type restrictions help differentiate between full users, guest users, and administrative users.","help_text":"Consider whether different user types (employees, contractors, guests) should be counted differently.","recommended_answer":{"MultiChoice":["all_counted"]},"legal_implications":"User type definitions must be clear and consistently applied to prevent license gaming.","question_type":"MultiChoice","options":[{"label":"All users counted equally","value":"all_counted","description":"Every user counts toward the license limit"},{"label":"Guest users excluded","value":"guests_excluded","description":"Temporary or guest users do not count toward the limit"},{"label":"Read-only users excluded","value":"readonly_excluded","description":"Users with read-only access do not count"},{"label":"External users separate","value":"external_separate","description":"External users have separate licensing terms"}],"visible_if":{"question_id":"user-001","operator":"Equals","value":{"Boolean":true}},"weight":5},{"id":"user-004","category":"PerUser","title":"What user authentication requirements apply?","description":"Specify the authentication and authorization requirements that users must meet to access the software.","tooltip":"Authentication requirements help ensure that only authorized users access the software and that user counts are accurate.","help_text":"Consider single sign-on (SSO), multi-factor authentication (MFA), and directory integration requirements.","recommended_answer":{"Text":"Users must authenticate using the organization's identity provider with SSO or multi-factor authentication enabled."},"legal_implications":"Weak authentication requirements can lead to unauthorized access and inaccurate user counting for licensing purposes.","question_type":"Text","options":[],"visible_if":{"question_id":"user-001","operator":"Equals","value":{"Boolean":true}},"weight":5},{"id":"dev-001","category":"PerDevice","title":"Is per-device licensing used for this software?","description":"Determine whether the license is priced based on the number of devices on which the software is installed or used.","tooltip":"Per-device licensing charges based on installed devices, regardless of how many users access each device.","help_text":"Per-device licensing is common for embedded software, IoT applications, and point-of-sale systems.","recommended_answer":{"Boolean":false},"legal_implications":"Per-device licensing requires mechanisms to track device installations and prevent unauthorized deployment.","question_type":"Boolean","options":[],"visible_if":null,"weight":6},{"id":"dev-002","category":"PerDevice","title":"What is the maximum number of devices?","description":"Specify the maximum number of devices on which the software can be installed or used under the license.","tooltip":"Device limits help control deployment scope and ensure compliance with licensing terms.","help_text":"Consider whether to offer unlimited device licenses or tiered pricing based on device count.","recommended_answer":{"Number":0},"legal_implications":"Exceeding device limits without proper licensing constitutes a license violation.","question_type":"Number","options":[],"visible_if":{"question_id":"dev-001","operator":"Equals","value":{"Boolean":true}},"weight":6},{"id":"dev-003","category":"PerDevice","title":"Are there device type restrictions?","description":"Select restrictions on what types of devices can be used with this software license.","tooltip":"Device type restrictions can limit the software to specific platforms or device categories.","help_text":"Consider whether to restrict to desktop, mobile, server, IoT, or other device types.","recommended_answer":{"MultiChoice":["any_device"]},"legal_implications":"Device type restrictions must be clearly defined to avoid disputes about what constitutes a licensed device type.","question_type":"MultiChoice","options":[{"label":"Any device type","value":"any_device","description":"Software can be installed on any device"},{"label":"Desktop only","value":"desktop","description":"Limited to desktop and laptop computers"},{"label":"Server only","value":"server","description":"Limited to server environments"},{"label":"Mobile only","value":"mobile","description":"Limited to mobile devices (phones, tablets)"}],"visible_if":{"question_id":"dev-001","operator":"Equals","value":{"Boolean":true}},"weight":5},{"id":"dev-004","category":"PerDevice","title":"Is device migration allowed?","description":"Determine whether the software license can be transferred from one device to another when hardware is replaced.","tooltip":"Device migration rights affect the flexibility of license management during hardware refresh cycles.","help_text":"Consider whether migration requires notification, deactivation of the old device, or additional fees.","recommended_answer":{"Boolean":true},"legal_implications":"Restricting device migration can create unnecessary friction during normal hardware lifecycle management.","question_type":"Boolean","options":[],"visible_if":{"question_id":"dev-001","operator":"Equals","value":{"Boolean":true}},"weight":5},{"id":"cpu-001","category":"PerCpu","title":"Is per-CPU licensing used for this software?","description":"Determine whether the license is priced based on the number of CPU cores or processors on which the software runs.","tooltip":"Per-CPU licensing charges based on computing resources, which correlates with the software's resource consumption.","help_text":"Per-CPU licensing is common for database software, application servers, and high-performance computing.","recommended_answer":{"Boolean":false},"legal_implications":"Per-CPU licensing requires clear definitions of what constitutes a 'CPU' and how core counts are calculated.","question_type":"Boolean","options":[],"visible_if":null,"weight":6},{"id":"cpu-002","category":"PerCpu","title":"How are CPU cores counted for licensing purposes?","description":"Specify the method used to count CPU cores for license compliance, especially in virtualized environments.","tooltip":"Core counting methods vary significantly between physical and virtual environments, affecting license costs.","help_text":"Consider whether to count physical cores, logical cores (hyper-threaded), or virtual cores assigned to VMs.","recommended_answer":{"Choice":"physical_cores"},"legal_implications":"Ambiguous core counting methods can lead to under-counting (non-compliance) or over-counting (overpayment).","question_type":"Choice","options":[{"label":"Physical CPU cores","value":"physical_cores","description":"Count the total physical cores in the machine"},{"label":"Logical CPU cores","value":"logical_cores","description":"Count logical cores including hyper-threaded cores"},{"label":"Assigned virtual cores","value":"vcores","description":"Count only the virtual cores assigned to the VM"},{"label":"Per-processor socket","value":"per_socket","description":"Count CPU sockets rather than individual cores"}],"visible_if":{"question_id":"cpu-001","operator":"Equals","value":{"Boolean":true}},"weight":6},{"id":"cpu-003","category":"PerCpu","title":"How are virtual CPUs handled for licensing?","description":"Determine how virtual CPUs (vCPUs) in virtualized or cloud environments are counted for license compliance.","tooltip":"Virtual CPU licensing is a complex area that requires clear rules for cloud and virtualization environments.","help_text":"Consider whether vCPUs are counted the same as physical cores or have special licensing terms.","recommended_answer":{"Choice":"same_as_physical"},"legal_implications":"Virtual CPU licensing terms must address major hypervisors (VMware, Hyper-V, KVM) and cloud platforms (AWS, Azure, GCP).","question_type":"Choice","options":[{"label":"Same as physical cores","value":"same_as_physical","description":"Virtual CPUs are counted the same as physical cores"},{"label":"Per-VM licensing","value":"per_vm","description":"Each VM requires a separate license based on its vCPU count"},{"label":"Host-based licensing","value":"host_based","description":"License covers the entire host, regardless of how many VMs run on it"},{"label":"Cloud provider terms","value":"cloud_terms","description":"License terms follow the cloud provider's own CPU definitions"}],"visible_if":{"question_id":"cpu-001","operator":"Equals","value":{"Boolean":true}},"weight":6},{"id":"cpu-004","category":"PerCpu","title":"Are there multi-processor licensing considerations?","description":"Determine whether the license terms address multi-processor systems and how multiple CPU sockets are counted.","tooltip":"Multi-processor licensing affects servers with multiple CPU sockets, which are common in enterprise environments.","help_text":"Consider whether each processor socket requires a separate license or if a single license covers all sockets in a machine.","recommended_answer":{"Choice":"per_socket"},"legal_implications":"Multi-processor licensing terms must be clearly defined to prevent under-licensing on high-performance server hardware.","question_type":"Choice","options":[{"label":"Per-socket license","value":"per_socket","description":"Each CPU socket requires a separate license"},{"label":"Per-machine license","value":"per_machine","description":"One license covers all CPUs in a single machine"},{"label":"Unlimited processors","value":"unlimited","description":"No restrictions on number of processors"}],"visible_if":{"question_id":"cpu-001","operator":"Equals","value":{"Boolean":true}},"weight":5},{"id":"comp-001","category":"PerCompany","title":"Is per-company licensing used for this software?","description":"Determine whether the license covers an entire company or organization, rather than counting individual users or devices.","tooltip":"Per-company licensing provides simplicity by covering all users and devices within a single legal entity.","help_text":"Per-company licensing is common for enterprise agreements and site licenses.","recommended_answer":{"Boolean":false},"legal_implications":"Per-company licensing must clearly define what constitutes a 'company' and address subsidiaries and affiliates.","question_type":"Boolean","options":[],"visible_if":null,"weight":6},{"id":"comp-002","category":"PerCompany","title":"Does per-company licensing cover subsidiaries?","description":"Determine whether the license extends to subsidiaries, affiliates, and related companies of the licensed organization.","tooltip":"Subsidiary coverage affects the scope and value of per-company licensing for large organizations.","help_text":"Consider whether to include all subsidiaries, only majority-owned subsidiaries, or no subsidiaries at all.","recommended_answer":{"Choice":"parent_only"},"legal_implications":"Unclear subsidiary terms can lead to disputes about whether affiliated companies are covered by the license.","question_type":"Choice","options":[{"label":"Parent company only","value":"parent_only","description":"License covers only the direct parent company"},{"label":"All subsidiaries included","value":"all_subsidiaries","description":"License extends to all subsidiaries and affiliates"},{"label":"Majority-owned subsidiaries","value":"majority_owned","description":"License covers subsidiaries with >50% ownership"},{"label":"Custom subsidiary terms","value":"custom","description":"Subsidiary coverage defined in the license agreement"}],"visible_if":{"question_id":"comp-001","operator":"Equals","value":{"Boolean":true}},"weight":5},{"id":"comp-003","category":"PerCompany","title":"Is there a company size restriction for licensing?","description":"Specify the maximum number of employees or revenue threshold that qualifies an organization for per-company licensing.","tooltip":"Size restrictions ensure that per-company pricing is appropriate for the organization's scale.","help_text":"Consider whether to offer different pricing tiers based on company size (e.g., SMB, mid-market, enterprise).","recommended_answer":{"Number":0},"legal_implications":"Company size restrictions must be clearly defined and verifiable to prevent gaming of pricing tiers.","question_type":"Number","options":[],"visible_if":{"question_id":"comp-001","operator":"Equals","value":{"Boolean":true}},"weight":5},{"id":"comp-004","category":"PerCompany","title":"What happens to the license during company mergers or acquisitions?","description":"Specify the terms that apply when the licensed company undergoes a merger, acquisition, or corporate restructuring.","tooltip":"Merger and acquisition provisions protect both parties when the licensed organization changes ownership.","help_text":"Consider whether the license transfers automatically, requires renegotiation, or can be terminated.","recommended_answer":{"Text":"License transfers to the acquiring entity; notification required within 30 days of transaction closing; pricing may be adjusted if organization size changes significantly."},"legal_implications":"M&A provisions must account for various corporate restructuring scenarios to prevent license disputes.","question_type":"Text","options":[],"visible_if":{"question_id":"comp-001","operator":"Equals","value":{"Boolean":true}},"weight":5},{"id":"oc-001","category":"OpenCore","title":"Does this project use an open-core licensing model?","description":"Determine whether the project uses an open-core model where the core software is open source but premium features are proprietary.","tooltip":"Open core combines the benefits of open-source community adoption with commercial revenue from premium features.","help_text":"Consider which features should be in the open core vs. the commercial tier.","recommended_answer":{"Boolean":false},"legal_implications":"Open core requires clear boundaries between open-source and proprietary features to prevent licensing confusion.","question_type":"Boolean","options":[],"visible_if":null,"weight":7},{"id":"oc-002","category":"OpenCore","title":"What is the split between core and premium features?","description":"Describe which features are included in the open-source core and which are reserved for the commercial premium tier.","tooltip":"Feature split decisions determine the project's commercial viability and community adoption potential.","help_text":"Consider whether the core provides enough value for community adoption while the premium tier provides enough value for commercial revenue.","recommended_answer":{"Text":"Core: basic functionality, CLI tools, API access, documentation. Premium: advanced analytics, enterprise SSO, audit logging, priority support, custom integrations."},"legal_implications":"The feature split must be clearly documented and consistently applied to prevent disputes about what is open-source vs. proprietary.","question_type":"Text","options":[],"visible_if":{"question_id":"oc-001","operator":"Equals","value":{"Boolean":true}},"weight":6},{"id":"oc-003","category":"OpenCore","title":"What license applies to the open-source core?","description":"Choose the open-source license that applies to the core features of the software.","tooltip":"The core license determines the open-source obligations and freedoms for the base software.","help_text":"Consider whether a permissive license (MIT, Apache) or copyleft license (GPL, AGPL) best fits the project's goals.","recommended_answer":{"Choice":"apache2"},"legal_implications":"The core license must be compatible with the overall open-core strategy and community expectations.","question_type":"Choice","options":[{"label":"MIT License","value":"mit","description":"Very permissive, minimal restrictions"},{"label":"Apache License 2.0","value":"apache2","description":"Permissive with patent grant and attribution requirements"},{"label":"GNU GPL v3","value":"gpl3","description":"Strong copyleft, derivative works must be GPL"},{"label":"GNU AGPL v3","value":"agpl3","description":"Network copyleft, SaaS use triggers source disclosure"}],"visible_if":{"question_id":"oc-001","operator":"Equals","value":{"Boolean":true}},"weight":6},{"id":"oc-004","category":"OpenCore","title":"What is the premium feature license?","description":"Specify the license terms that apply to premium features and the commercial tier of the software.","tooltip":"Premium feature licensing determines the commercial terms and obligations for paid features.","help_text":"Consider whether premium features use a proprietary license, commercial license, or dual license model.","recommended_answer":{"Text":"Proprietary commercial license; source code not available; license grants right to use, modify, and distribute only as authorized by the commercial agreement."},"legal_implications":"Premium licensing must be clearly differentiated from the core license to prevent confusion and potential legal disputes.","question_type":"Text","options":[],"visible_if":{"question_id":"oc-001","operator":"Equals","value":{"Boolean":true}},"weight":5},{"id":"ef-001","category":"EnterpriseFeatures","title":"Are enterprise-specific features included in the license?","description":"Determine whether features designed for enterprise customers (SSO, audit logging, compliance tools) are covered by the license.","tooltip":"Enterprise features often justify premium pricing and are essential for large organization adoption.","help_text":"Consider whether enterprise features are part of the core open-source offering or reserved for the commercial tier.","recommended_answer":{"Boolean":false},"legal_implications":"Enterprise feature licensing must be clearly separated from community features to prevent disputes about access rights.","question_type":"Boolean","options":[],"visible_if":null,"weight":6},{"id":"ef-002","category":"EnterpriseFeatures","title":"What enterprise features require a separate license?","description":"Select the enterprise features that are not included in the base license and require additional licensing.","tooltip":"Enterprise feature selection determines the commercial value and target audience for the premium offering.","help_text":"Consider which features are essential for enterprise compliance and which are nice-to-have enhancements.","recommended_answer":{"MultiChoice":["sso","audit_logging","compliance"]},"legal_implications":"Enterprise feature boundaries must be clearly defined and documented to prevent scope disputes.","question_type":"MultiChoice","options":[{"label":"Single Sign-On (SSO)","value":"sso","description":"Enterprise identity provider integration"},{"label":"Audit logging","value":"audit_logging","description":"Detailed activity logs for compliance"},{"label":"Compliance tools","value":"compliance","description":"Built-in compliance and reporting features"},{"label":"Priority support","value":"priority_support","description":"Dedicated support channel and SLA guarantees"}],"visible_if":{"question_id":"ef-001","operator":"Equals","value":{"Boolean":true}},"weight":5},{"id":"ef-003","category":"EnterpriseFeatures","title":"What is the pricing model for enterprise features?","description":"Choose the pricing model for enterprise-specific features and capabilities.","tooltip":"Enterprise pricing models determine how enterprise customers are charged for premium features.","help_text":"Consider per-user, per-transaction, flat-rate, or usage-based pricing for enterprise features.","recommended_answer":{"Choice":"per_user"},"legal_implications":"Enterprise pricing terms must be clearly documented and consistently applied across all customers.","question_type":"Choice","options":[{"label":"Per-user pricing","value":"per_user","description":"Price per authorized user accessing enterprise features"},{"label":"Flat-rate pricing","value":"flat_rate","description":"Fixed price regardless of usage or user count"},{"label":"Usage-based pricing","value":"usage_based","description":"Price based on actual feature usage metrics"},{"label":"Included in base license","value":"included","description":"Enterprise features are included at no additional cost"}],"visible_if":{"question_id":"ef-001","operator":"Equals","value":{"Boolean":true}},"weight":5},{"id":"ef-004","category":"EnterpriseFeatures","title":"Is enterprise support included with enterprise features?","description":"Determine whether purchasing enterprise features includes dedicated enterprise support services.","tooltip":"Enterprise support is often a key differentiator for commercial customers choosing between open-source and enterprise offerings.","help_text":"Consider SLA guarantees, response times, dedicated support engineers, and escalation procedures.","recommended_answer":{"Boolean":true},"legal_implications":"Support SLAs must be clearly defined with measurable commitments to be legally enforceable.","question_type":"Boolean","options":[],"visible_if":{"question_id":"ef-001","operator":"Equals","value":{"Boolean":true}},"weight":4},{"id":"ff-001","category":"FeatureFlags","title":"Are feature flags used for licensing control?","description":"Determine whether the software uses feature flags or feature gates to control access to specific capabilities based on the license type.","tooltip":"Feature flags allow fine-grained control over which features are available under different license tiers.","help_text":"Consider whether feature flags are used for licensing, A/B testing, or gradual rollout purposes.","recommended_answer":{"Boolean":false},"legal_implications":"Feature flag licensing controls must be robust and tamper-resistant to prevent unauthorized feature access.","question_type":"Boolean","options":[],"visible_if":null,"weight":6},{"id":"ff-002","category":"FeatureFlags","title":"How are feature flags enforced?","description":"Choose the enforcement mechanism for feature flags that control access to licensed features.","tooltip":"Enforcement mechanisms determine how difficult it is for users to bypass feature restrictions.","help_text":"Consider server-side enforcement, client-side enforcement, or hybrid approaches.","recommended_answer":{"Choice":"server_side"},"legal_implications":"Weak enforcement mechanisms may be circumvented, leading to revenue loss and license violations.","question_type":"Choice","options":[{"label":"Server-side enforcement","value":"server_side","description":"Feature access controlled by the server; client cannot bypass restrictions"},{"label":"Client-side enforcement","value":"client_side","description":"Feature access controlled by client configuration; can be modified by users"},{"label":"License key validation","value":"license_key","description":"Features unlocked by validating a license key against a license server"},{"label":"No enforcement","value":"none","description":"Feature flags are advisory only and not enforced"}],"visible_if":{"question_id":"ff-001","operator":"Equals","value":{"Boolean":true}},"weight":5},{"id":"ff-003","category":"FeatureFlags","title":"Is bypassing feature flags prohibited?","description":"Determine whether circumventing, disabling, or tampering with feature flags is explicitly prohibited under the license.","tooltip":"Anti-bypass provisions help protect the commercial value of premium features.","help_text":"Consider whether bypass is a license violation, a breach of contract, or simply prohibited behavior.","recommended_answer":{"Boolean":true},"legal_implications":"Anti-bypass provisions must be enforceable and not conflict with user rights under applicable law (e.g., DMCA exceptions).","question_type":"Boolean","options":[],"visible_if":{"question_id":"ff-001","operator":"Equals","value":{"Boolean":true}},"weight":5},{"id":"ff-004","category":"FeatureFlags","title":"Is an audit trail maintained for feature flag changes?","description":"Determine whether changes to feature flags and their states are logged for compliance and security purposes.","tooltip":"Audit trails help detect unauthorized feature access and provide evidence for license compliance reviews.","help_text":"Consider what events are logged, how long logs are retained, and who has access to audit logs.","recommended_answer":{"Boolean":true},"legal_implications":"Feature flag audit trails provide evidence for license compliance enforcement in case of disputes.","question_type":"Boolean","options":[],"visible_if":{"question_id":"ff-001","operator":"Equals","value":{"Boolean":true}},"weight":4},{"id":"telem-001","category":"Telemetry","title":"Is telemetry collection included in the software?","description":"Determine whether the software collects and transmits usage data, performance metrics, or other telemetry information.","tooltip":"Telemetry data helps developers understand how the software is used and identify areas for improvement.","help_text":"Consider whether telemetry is optional, mandatory, or configurable by the user.","recommended_answer":{"Boolean":false},"legal_implications":"Telemetry collection must comply with applicable privacy laws (GDPR, CCPA) and be clearly disclosed to users.","question_type":"Boolean","options":[],"visible_if":null,"weight":6},{"id":"telem-002","category":"Telemetry","title":"Is telemetry opt-out allowed?","description":"Determine whether users can disable or opt out of telemetry collection without losing access to the software's core functionality.","tooltip":"Opt-out rights are required by many privacy regulations and are considered a best practice for user trust.","help_text":"Consider whether opt-out is simple, clearly documented, and does not degrade the user experience.","recommended_answer":{"Boolean":true},"legal_implications":"Mandatory telemetry without opt-out options may violate privacy regulations in some jurisdictions.","question_type":"Boolean","options":[],"visible_if":{"question_id":"telem-001","operator":"Equals","value":{"Boolean":true}},"weight":6},{"id":"telem-003","category":"Telemetry","title":"How is telemetry data used?","description":"Select the purposes for which collected telemetry data may be used by the software developer or licensor.","tooltip":"Transparent use of telemetry data builds trust with users and ensures compliance with privacy regulations.","help_text":"Consider product improvement, bug fixes, usage analytics, and security monitoring as potential uses.","recommended_answer":{"MultiChoice":["product_improvement","bug_fixes"]},"legal_implications":"Telemetry data usage must be consistent with the purposes disclosed to users at the time of collection.","question_type":"MultiChoice","options":[{"label":"Product improvement","value":"product_improvement","description":"Data used to improve software features and user experience"},{"label":"Bug fixes","value":"bug_fixes","description":"Data used to identify and fix software bugs"},{"label":"Usage analytics","value":"analytics","description":"Data used for aggregate usage statistics and reporting"},{"label":"Security monitoring","value":"security","description":"Data used to detect and prevent security threats"}],"visible_if":{"question_id":"telem-001","operator":"Equals","value":{"Boolean":true}},"weight":5},{"id":"telem-004","category":"Telemetry","title":"Is telemetry data shared with third parties?","description":"Determine whether collected telemetry data may be shared with third-party service providers or other parties.","tooltip":"Third-party data sharing must be disclosed to users and comply with applicable data protection regulations.","help_text":"Consider whether data is shared with analytics providers, advertising networks, or research institutions.","recommended_answer":{"Boolean":false},"legal_implications":"Undisclosed third-party data sharing can violate privacy regulations and damage user trust.","question_type":"Boolean","options":[],"visible_if":{"question_id":"telem-001","operator":"Equals","value":{"Boolean":true}},"weight":5},{"id":"privy-001","category":"Privacy","title":"Does the license include privacy provisions?","description":"Determine whether the license addresses data privacy and personal data processing requirements.","tooltip":"Privacy provisions help ensure compliance with data protection regulations like GDPR and CCPA.","help_text":"Consider whether privacy terms should be included in the license itself or in a separate privacy policy.","recommended_answer":{"Boolean":true},"legal_implications":"Lack of privacy provisions in the license may expose both the licensor and licensee to regulatory penalties.","question_type":"Boolean","options":[],"visible_if":null,"weight":8},{"id":"privy-002","category":"Privacy","title":"Which privacy regulations must be complied with?","description":"Select the privacy regulations and frameworks that the software must comply with when processing personal data.","tooltip":"Privacy regulation compliance is mandatory for software that processes personal data of individuals in regulated jurisdictions.","help_text":"Consider GDPR (EU), CCPA/CPRA (California), PIPEDA (Canada), LGPD (Brazil), and other applicable regulations.","recommended_answer":{"MultiChoice":["gdpr","ccpa"]},"legal_implications":"Non-compliance with applicable privacy regulations can result in significant fines and reputational damage.","question_type":"MultiChoice","options":[{"label":"GDPR (EU)","value":"gdpr","description":"EU General Data Protection Regulation"},{"label":"CCPA/CPRA (California)","value":"ccpa","description":"California Consumer Privacy Act / California Privacy Rights Act"},{"label":"PIPEDA (Canada)","value":"pippeda","description":"Canadian Personal Information Protection and Electronic Documents Act"},{"label":"LGPD (Brazil)","value":"lgpd","description":"Brazilian Lei Geral de Protecao de Dados"}],"visible_if":{"question_id":"privy-001","operator":"Equals","value":{"Boolean":true}},"weight":7},{"id":"privy-003","category":"Privacy","title":"What data processing terms apply?","description":"Describe the key data processing terms and obligations that apply when the software processes personal data.","tooltip":"Data processing terms define the roles, responsibilities, and obligations of parties when personal data is involved.","help_text":"Consider data processor vs. data controller roles, sub-processor requirements, and international data transfers.","recommended_answer":{"Text":"The licensor acts as data processor; the licensee is data controller. Standard contractual clauses apply for international transfers. Sub-processors must be disclosed and approved."},"legal_implications":"Data processing terms must comply with applicable data protection laws and be reflected in binding agreements between parties.","question_type":"Text","options":[],"visible_if":{"question_id":"privy-001","operator":"Equals","value":{"Boolean":true}},"weight":7},{"id":"privy-004","category":"Privacy","title":"Are privacy audit requirements included?","description":"Determine whether privacy audits or assessments must be conducted to verify compliance with privacy provisions.","tooltip":"Privacy audits help verify that the software and its operators are complying with privacy regulations and license terms.","help_text":"Consider whether audits are conducted by the licensor, an independent auditor, or the licensee's internal team.","recommended_answer":{"Boolean":false},"legal_implications":"Privacy audit requirements add compliance costs but provide assurance that privacy obligations are being met.","question_type":"Boolean","options":[],"visible_if":{"question_id":"privy-001","operator":"Equals","value":{"Boolean":true}},"weight":5},{"id":"child-001","category":"Children","title":"Is use of this software by children permitted?","description":"Determine whether children (typically under 13 or 16, depending on jurisdiction) are permitted to use the software.","tooltip":"Children's use of software is subject to special regulations like COPPA (US) and GDPR provisions for minors (EU).","help_text":"Consider whether the software is designed for children or if children might incidentally use it.","recommended_answer":{"Boolean":true},"legal_implications":"Software accessible to children must comply with child protection regulations, which have specific consent and data collection requirements.","question_type":"Boolean","options":[],"visible_if":null,"weight":6},{"id":"child-002","category":"Children","title":"What is the minimum age requirement for using this software?","description":"Specify the minimum age at which users can independently use the software without parental or guardian consent.","tooltip":"Age requirements help ensure compliance with child protection laws and protect younger users from inappropriate content.","help_text":"Common age thresholds are 13 (COPPA), 16 (GDPR), or 18 (majority age).","recommended_answer":{"Number":13},"legal_implications":"Age requirements must comply with the strictest applicable child protection law in the jurisdictions where the software is available.","question_type":"Number","options":[],"visible_if":{"question_id":"child-001","operator":"Equals","value":{"Boolean":true}},"weight":6},{"id":"child-003","category":"Children","title":"Is parental consent required for children's use?","description":"Determine whether children under the specified age must obtain parental or guardian consent before using the software.","tooltip":"Parental consent requirements are mandated by COPPA and similar child protection laws for software directed at children.","help_text":"Consider what form of consent is acceptable (written, digital, opt-in, etc.).","recommended_answer":{"Boolean":true},"legal_implications":"Failure to obtain required parental consent can result in regulatory enforcement actions and significant penalties.","question_type":"Boolean","options":[],"visible_if":{"question_id":"child-001","operator":"Equals","value":{"Boolean":true}},"weight":6},{"id":"child-004","category":"Children","title":"Is COPPA compliance required for use in the United States?","description":"Determine whether the software must comply with the Children's Online Privacy Protection Act (COPPA) when used by or directed at children in the US.","tooltip":"COPPA imposes specific requirements on software and online services that collect personal information from children under 13.","help_text":"COPPA compliance requires parental consent, data minimization, and restrictions on targeted advertising to children.","recommended_answer":{"Boolean":false},"legal_implications":"COPPA violations can result in FTC enforcement actions with penalties up to $50,120 per violation.","question_type":"Boolean","options":[],"visible_if":{"question_id":"child-001","operator":"Equals","value":{"Boolean":true}},"weight":5},{"id":"hc-001","category":"Healthcare","title":"Is use of this software in healthcare applications permitted?","description":"Determine whether the software can be used in healthcare contexts, including medical devices, clinical systems, and health data processing.","tooltip":"Healthcare use is subject to strict regulations including HIPAA, FDA requirements, and medical device standards.","help_text":"Consider whether the software is intended for healthcare use or if healthcare use is incidental.","recommended_answer":{"Choice":"permitted"},"legal_implications":"Healthcare use without proper regulatory compliance can result in severe penalties and patient safety risks.","question_type":"Choice","options":[{"label":"Permitted","value":"permitted","description":"Healthcare use is allowed subject to regulatory compliance"},{"label":"Permitted with conditions","value":"conditional","description":"Healthcare use requires additional compliance measures"},{"label":"Not recommended for healthcare","value":"not_recommended","description":"Software is not designed for healthcare use but not explicitly prohibited"},{"label":"Prohibited for healthcare","value":"prohibited","description":"Software cannot be used in healthcare applications"}],"visible_if":null,"weight":7},{"id":"hc-002","category":"Healthcare","title":"Is HIPAA compliance required for healthcare use?","description":"Determine whether the software must comply with the Health Insurance Portability and Accountability Act (HIPAA) when processing protected health information (PHI).","tooltip":"HIPAA compliance is mandatory for any software that processes, stores, or transmits PHI in the United States.","help_text":"Consider whether the software is a HIPAA-covered entity, a business associate, or neither.","recommended_answer":{"Boolean":false},"legal_implications":"HIPAA violations can result in penalties ranging from $100 to $50,000 per violation, up to $1.5 million annually per category.","question_type":"Boolean","options":[],"visible_if":{"question_id":"hc-001","operator":"Equals","value":{"Choice":"permitted"}},"weight":7},{"id":"hc-003","category":"Healthcare","title":"What medical device classification applies?","description":"Specify the FDA or equivalent regulatory classification if the software is intended for use as or within a medical device.","tooltip":"Medical device classification determines the level of regulatory scrutiny and approval requirements for the software.","help_text":"Consider whether the software is a SaMD (Software as a Medical Device) or part of a larger medical device system.","recommended_answer":{"Choice":"not_medical_device"},"legal_implications":"Incorrectly classifying medical device software can result in regulatory enforcement actions and patient safety risks.","question_type":"Choice","options":[{"label":"Not a medical device","value":"not_medical_device","description":"Software is not intended for medical use"},{"label":"FDA Class I","value":"fda_class_1","description":"Low-risk medical device, general controls apply"},{"label":"FDA Class II","value":"fda_class_2","description":"Moderate-risk medical device, special controls apply"},{"label":"FDA Class III","value":"fda_class_3","description":"High-risk medical device, premarket approval required"}],"visible_if":{"question_id":"hc-001","operator":"Equals","value":{"Choice":"permitted"}},"weight":7},{"id":"hc-004","category":"Healthcare","title":"What healthcare data handling requirements apply?","description":"Select the requirements for how healthcare data (PHI, ePHI, clinical data) must be handled when using the software.","tooltip":"Healthcare data handling requirements ensure compliance with HIPAA, HITECH, and other healthcare data protection regulations.","help_text":"Consider encryption, access controls, audit logging, and data retention requirements for healthcare data.","recommended_answer":{"MultiChoice":["encryption","access_controls","audit_logging"]},"legal_implications":"Inadequate healthcare data handling can result in HIPAA breaches with significant financial and reputational consequences.","question_type":"MultiChoice","options":[{"label":"Encryption at rest and in transit","value":"encryption","description":"All healthcare data must be encrypted both stored and during transmission"},{"label":"Role-based access controls","value":"access_controls","description":"Access to healthcare data must be restricted based on user roles"},{"label":"Comprehensive audit logging","value":"audit_logging","description":"All access to healthcare data must be logged for compliance purposes"},{"label":"Data minimization","value":"data_minimization","description":"Only the minimum necessary data should be collected and processed"}],"visible_if":{"question_id":"hc-001","operator":"Equals","value":{"Choice":"permitted"}},"weight":6},{"id":"fin-001","category":"Finance","title":"Is use of this software in financial applications permitted?","description":"Determine whether the software can be used in financial services, banking, trading, or other financial applications.","tooltip":"Financial use is subject to extensive regulatory requirements including SOX, PCI DSS, MiFID II, and Basel III.","help_text":"Consider whether the software is intended for financial use or if financial use is incidental.","recommended_answer":{"Choice":"permitted"},"legal_implications":"Financial use without proper regulatory compliance can result in severe penalties and financial losses for users.","question_type":"Choice","options":[{"label":"Permitted","value":"permitted","description":"Financial use is allowed subject to regulatory compliance"},{"label":"Permitted with conditions","value":"conditional","description":"Financial use requires additional compliance measures"},{"label":"Not recommended for financial use","value":"not_recommended","description":"Software is not designed for financial applications"},{"label":"Prohibited for financial use","value":"prohibited","description":"Software cannot be used in financial applications"}],"visible_if":null,"weight":7},{"id":"fin-002","category":"Finance","title":"What financial regulation compliance is required?","description":"Select the financial regulations and frameworks that the software must comply with when used in financial applications.","tooltip":"Financial regulation compliance varies by jurisdiction and type of financial activity.","help_text":"Consider SOX (US), PCI DSS (payments), MiFID II (EU trading), Basel III (banking), and DORA (EU digital resilience).","recommended_answer":{"MultiChoice":["pci_dss"]},"legal_implications":"Non-compliance with financial regulations can result in fines, license revocation, and criminal prosecution.","question_type":"MultiChoice","options":[{"label":"PCI DSS (payment data)","value":"pci_dss","description":"Payment Card Industry Data Security Standard for payment processing"},{"label":"SOX (corporate governance)","value":"sox","description":"Sarbanes-Oxley Act for financial reporting and internal controls"},{"label":"MiFID II (trading)","value":"mifid2","description":"Markets in Financial Instruments Directive for EU trading"},{"label":"Basel III (banking)","value":"basel3","description":"International banking regulation framework"}],"visible_if":{"question_id":"fin-001","operator":"Equals","value":{"Choice":"permitted"}},"weight":7},{"id":"fin-003","category":"Finance","title":"Is a fiduciary responsibility disclaimer included?","description":"Determine whether the license includes a disclaimer stating that the software does not create a fiduciary relationship between the licensor and licensee.","tooltip":"Fiduciary disclaimers protect the licensor from liability for financial decisions made based on the software's output.","help_text":"This is especially important for software used in investment, trading, or advisory contexts.","recommended_answer":{"Boolean":true},"legal_implications":"Without a fiduciary disclaimer, the licensor could be held liable for financial losses if users rely on the software for fiduciary decisions.","question_type":"Boolean","options":[],"visible_if":{"question_id":"fin-001","operator":"Equals","value":{"Choice":"permitted"}},"weight":6},{"id":"fin-004","category":"Finance","title":"What financial data handling requirements apply?","description":"Specify the requirements for how financial data must be handled when using the software in financial applications.","tooltip":"Financial data handling requirements ensure the security and integrity of sensitive financial information.","help_text":"Consider encryption, access controls, audit trails, and data retention policies for financial data.","recommended_answer":{"Text":"Financial data must be encrypted at rest and in transit; access must be logged and auditable; data retention must comply with applicable financial record-keeping regulations."},"legal_implications":"Inadequate financial data handling can result in data breaches, regulatory penalties, and loss of customer trust.","question_type":"Text","options":[],"visible_if":{"question_id":"fin-001","operator":"Equals","value":{"Choice":"permitted"}},"weight":6},{"id":"govu-001","category":"GovernmentUse","title":"Is specific government use beyond general government agency use addressed?","description":"Determine whether the license addresses specialized government use cases such as law enforcement, public safety, or regulatory compliance systems.","tooltip":"Specialized government use often has different regulatory requirements and security classifications.","help_text":"Consider whether law enforcement, public safety, and regulatory systems need different terms than general government use.","recommended_answer":{"Boolean":true},"legal_implications":"Specialized government use terms must address security classification, background check requirements, and audit obligations.","question_type":"Boolean","options":[],"visible_if":{"question_id":"gov-001","operator":"Equals","value":{"Boolean":true}},"weight":5},{"id":"govu-002","category":"GovernmentUse","title":"Are there government agency restrictions?","description":"Select restrictions that apply to specific government agencies or departments using the software.","tooltip":"Agency-specific restrictions can target particular government activities or departments of concern.","help_text":"Consider whether to restrict use by intelligence agencies, law enforcement, or other specific departments.","recommended_answer":{"MultiChoice":[]},"legal_implications":"Government agency restrictions must be clearly defined and enforceable to be legally valid.","question_type":"MultiChoice","options":[{"label":"Intelligence agencies restricted","value":"intelligence","description":"Cannot be used by intelligence or spy agencies"},{"label":"Law enforcement restricted","value":"law_enforcement","description":"Cannot be used for law enforcement purposes"},{"label":"No agency restrictions","value":"none","description":"All government agencies can use the software"}],"visible_if":{"question_id":"gov-001","operator":"Equals","value":{"Boolean":true}},"weight":5},{"id":"govu-003","category":"GovernmentUse","title":"What government reporting requirements apply?","description":"Specify the reporting obligations that government users must fulfill when using the software.","tooltip":"Government reporting requirements ensure transparency and accountability in government software usage.","help_text":"Consider whether government users must report usage, security incidents, or compliance status to oversight bodies.","recommended_answer":{"Text":"Government users must comply with their agency's reporting requirements for software usage and security incidents."},"legal_implications":"Government reporting requirements must align with applicable regulations and agency policies.","question_type":"Text","options":[],"visible_if":{"question_id":"gov-001","operator":"Equals","value":{"Boolean":true}},"weight":4},{"id":"govu-004","category":"GovernmentUse","title":"Are government audit rights included?","description":"Determine whether government agencies have the right to audit the software's security, compliance, and functionality.","tooltip":"Government audit rights ensure that the software meets security and compliance standards required for government use.","help_text":"Consider whether audits can be conducted by the agency, an independent auditor, or the licensor's own team.","recommended_answer":{"Boolean":true},"legal_implications":"Government audit rights must be clearly defined with reasonable notice requirements and scope limitations.","question_type":"Boolean","options":[],"visible_if":{"question_id":"gov-001","operator":"Equals","value":{"Boolean":true}},"weight":5},{"id":"def-001","category":"Defense","title":"Is use in defense applications permitted?","description":"Determine whether the software can be used in defense-related applications, including weapons systems, intelligence, and military operations.","tooltip":"Defense use is subject to strict regulations including ITAR, EAR, and defense procurement requirements.","help_text":"Consider whether to allow all defense use, restrict certain types, or prohibit defense use entirely.","recommended_answer":{"Choice":"permitted"},"legal_implications":"Defense use without proper export control compliance can result in criminal prosecution under ITAR and EAR.","question_type":"Choice","options":[{"label":"Permitted","value":"permitted","description":"Defense use is allowed subject to applicable regulations"},{"label":"Permitted with restrictions","value":"restricted","description":"Defense use allowed but limited to specific types of applications"},{"label":"Not permitted","value":"not_permitted","description":"Defense use is prohibited"}],"visible_if":null,"weight":7},{"id":"def-002","category":"Defense","title":"Is ITAR compliance required?","description":"Determine whether the software must comply with the International Traffic in Arms Regulations (ITAR) when used in defense applications.","tooltip":"ITAR compliance is mandatory for software classified as defense articles or defense services under the US Munitions List.","help_text":"ITAR imposes strict restrictions on the export and transfer of defense-related articles and services.","recommended_answer":{"Boolean":false},"legal_implications":"ITAR violations can result in criminal penalties of up to $1 million and 20 years imprisonment per violation.","question_type":"Boolean","options":[],"visible_if":{"question_id":"def-001","operator":"Equals","value":{"Choice":"permitted"}},"weight":7},{"id":"def-003","category":"Defense","title":"What classification level restrictions apply?","description":"Specify whether the software is restricted to use at certain security classification levels.","tooltip":"Classification level restrictions ensure the software is used only in environments appropriate for its security profile.","help_text":"Consider whether the software can be used at Unclassified, Secret, Top Secret, or any classification level.","recommended_answer":{"Choice":"unclassified"},"legal_implications":"Using software at inappropriate classification levels can compromise national security and result in criminal penalties.","question_type":"Choice","options":[{"label":"Unclassified only","value":"unclassified","description":"Software can only be used in unclassified environments"},{"label":"Secret and below","value":"secret","description":"Software can be used up to Secret classification"},{"label":"Top Secret and below","value":"top_secret","description":"Software can be used at any classification level"},{"label":"No classification restrictions","value":"none","description":"No classification level restrictions apply"}],"visible_if":{"question_id":"def-001","operator":"Equals","value":{"Choice":"permitted"}},"weight":6},{"id":"def-004","category":"Defense","title":"What defense procurement terms apply?","description":"Specify the special terms that apply when the software is acquired through defense procurement processes.","tooltip":"Defense procurement terms must comply with DFARS, FAR, and other defense acquisition regulations.","help_text":"Consider whether special terms apply for DFARS compliance, source code escrow, or security requirements.","recommended_answer":{"Text":"Defense procurement must comply with applicable DFARS and FAR requirements; source code escrow may be required for mission-critical applications."},"legal_implications":"Non-compliance with defense procurement terms can result in contract termination, debarment, and financial penalties.","question_type":"Text","options":[],"visible_if":{"question_id":"def-001","operator":"Equals","value":{"Choice":"permitted"}},"weight":5},{"id":"bio-001","category":"Biotechnology","title":"Is use in biotechnology applications permitted?","description":"Determine whether the software can be used in biotechnology research, development, or manufacturing contexts.","tooltip":"Biotechnology use may be subject to biosafety regulations, GMO restrictions, and bioethics requirements.","help_text":"Consider whether the software is intended for biotech use or if biotech use is incidental.","recommended_answer":{"Choice":"permitted"},"legal_implications":"Biotechnology use without proper biosafety compliance can result in environmental harm and regulatory penalties.","question_type":"Choice","options":[{"label":"Permitted","value":"permitted","description":"Biotechnology use is allowed subject to applicable regulations"},{"label":"Permitted with conditions","value":"conditional","description":"Biotechnology use requires additional compliance measures"},{"label":"Not recommended for biotech","value":"not_recommended","description":"Software is not designed for biotechnology use"},{"label":"Prohibited for biotech","value":"prohibited","description":"Software cannot be used in biotechnology applications"}],"visible_if":null,"weight":6},{"id":"bio-002","category":"Biotechnology","title":"Is biosafety compliance required?","description":"Determine whether the software must comply with biosafety level (BSL) requirements when used in laboratory or manufacturing settings.","tooltip":"Biosafety compliance ensures that the software does not contribute to the release of dangerous biological agents.","help_text":"Consider whether the software interacts with biological systems or only processes biological data.","recommended_answer":{"Boolean":false},"legal_implications":"Non-compliance with biosafety regulations can result in quarantine orders, fines, and public health risks.","question_type":"Boolean","options":[],"visible_if":{"question_id":"bio-001","operator":"Equals","value":{"Choice":"permitted"}},"weight":5},{"id":"bio-003","category":"Biotechnology","title":"Are there GMO restrictions?","description":"Determine whether the software has restrictions on use in genetically modified organism (GMO) research or development.","tooltip":"GMO restrictions address ethical, environmental, and regulatory concerns related to genetic modification.","help_text":"Consider whether the software can be used for gene editing, synthetic biology, or other GMO-related work.","recommended_answer":{"Boolean":false},"legal_implications":"GMO-related use may be subject to different regulations depending on the jurisdiction and type of modification.","question_type":"Boolean","options":[],"visible_if":{"question_id":"bio-001","operator":"Equals","value":{"Choice":"permitted"}},"weight":5},{"id":"bio-004","category":"Biotechnology","title":"What biotech data sharing requirements apply?","description":"Choose the data sharing requirements that apply to biotechnology research data generated using the software.","tooltip":"Biotech data sharing requirements balance the need for scientific collaboration with intellectual property protection.","help_text":"Consider whether biotech data must be shared with research communities, regulators, or the public.","recommended_answer":{"Choice":"research_sharing"},"legal_implications":"Data sharing requirements must comply with applicable research data management regulations and institutional policies.","question_type":"Choice","options":[{"label":"Research community sharing","value":"research_sharing","description":"Data must be made available to the research community"},{"label":"Regulatory submission","value":"regulatory","description":"Data must be submitted to relevant regulatory authorities"},{"label":"No data sharing required","value":"none","description":"No specific data sharing obligations"}],"visible_if":{"question_id":"bio-001","operator":"Equals","value":{"Choice":"permitted"}},"weight":4},{"id":"nuc-001","category":"Nuclear","title":"Is use in nuclear applications permitted?","description":"Determine whether the software can be used in nuclear energy, nuclear research, or nuclear weapons-related applications.","tooltip":"Nuclear use is subject to strict regulations by the NRC, IAEA, and equivalent international bodies.","help_text":"Consider whether the software is intended for nuclear use or if nuclear use is incidental.","recommended_answer":{"Choice":"permitted"},"legal_implications":"Nuclear use without proper licensing can result in severe regulatory penalties and public safety risks.","question_type":"Choice","options":[{"label":"Permitted","value":"permitted","description":"Nuclear use is allowed subject to applicable regulations"},{"label":"Permitted for non-weapons","value":"non_weapons","description":"Nuclear use allowed for energy and research, not weapons"},{"label":"Not permitted","value":"not_permitted","description":"Nuclear use is prohibited"}],"visible_if":null,"weight":6},{"id":"nuc-002","category":"Nuclear","title":"Is nuclear safety compliance required?","description":"Determine whether the software must comply with nuclear safety standards when used in nuclear facilities or research.","tooltip":"Nuclear safety compliance ensures the software does not contribute to nuclear accidents or safety hazards.","help_text":"Consider whether the software controls nuclear equipment or only processes nuclear-related data.","recommended_answer":{"Boolean":true},"legal_implications":"Non-compliance with nuclear safety standards can result in facility shutdowns and criminal prosecution.","question_type":"Boolean","options":[],"visible_if":{"question_id":"nuc-001","operator":"Equals","value":{"Choice":"permitted"}},"weight":5},{"id":"nuc-003","category":"Nuclear","title":"What nuclear regulatory requirements apply?","description":"Select the nuclear regulatory frameworks that must be complied with when using the software in nuclear contexts.","tooltip":"Nuclear regulatory requirements vary by country and type of nuclear activity.","help_text":"Consider NRC regulations (US), IAEA standards (international), and equivalent national regulations.","recommended_answer":{"MultiChoice":["nrc"]},"legal_implications":"Non-compliance with nuclear regulations can result in severe penalties including criminal prosecution.","question_type":"MultiChoice","options":[{"label":"NRC regulations (US)","value":"nrc","description":"US Nuclear Regulatory Commission requirements"},{"label":"IAEA standards (international)","value":"iaea","description":"International Atomic Energy Agency standards"},{"label":"National regulatory bodies","value":"national","description":"Applicable national nuclear regulatory requirements"}],"visible_if":{"question_id":"nuc-001","operator":"Equals","value":{"Choice":"permitted"}},"weight":5},{"id":"nuc-004","category":"Nuclear","title":"Is a nuclear liability disclaimer included?","description":"Determine whether the license includes a specific disclaimer of liability for nuclear-related damages or incidents.","tooltip":"Nuclear liability disclaimers are standard in software used in the nuclear industry due to the extreme potential for catastrophic damage.","help_text":"Nuclear liability disclaimers typically exclude all liability for nuclear incidents, regardless of cause.","recommended_answer":{"Boolean":true},"legal_implications":"Nuclear liability disclaimers must be carefully drafted to comply with the Price-Anderson Act and similar nuclear liability frameworks.","question_type":"Boolean","options":[],"visible_if":{"question_id":"nuc-001","operator":"Equals","value":{"Choice":"permitted"}},"weight":5},{"id":"robo-001","category":"Robotics","title":"Is use in robotics applications permitted?","description":"Determine whether the software can be used in robotic systems, including industrial robots, autonomous vehicles, and service robots.","tooltip":"Robotics use raises safety concerns and may be subject to different regulations depending on the robot type and application.","help_text":"Consider whether the software controls physical robots or only processes robot-related data.","recommended_answer":{"Boolean":true},"legal_implications":"Robotics software that controls physical systems may be subject to product liability and safety regulations.","question_type":"Boolean","options":[],"visible_if":null,"weight":6},{"id":"robo-002","category":"Robotics","title":"Are there autonomous operation restrictions?","description":"Select restrictions on how the software can be used in autonomous or semi-autonomous robotic systems.","tooltip":"Autonomous operation restrictions address safety and ethical concerns about robots operating without human oversight.","help_text":"Consider whether autonomous operation is allowed, restricted to certain environments, or prohibited entirely.","recommended_answer":{"MultiChoice":["human_oversight"]},"legal_implications":"Autonomous operation without appropriate safeguards can result in product liability claims and regulatory action.","question_type":"MultiChoice","options":[{"label":"Human oversight required","value":"human_oversight","description":"Autonomous robots must have human oversight at all times"},{"label":"No autonomous operation","value":"no_autonomous","description":"Software cannot be used for fully autonomous robots"},{"label":"Unrestricted autonomous operation","value":"unrestricted","description":"No restrictions on autonomous operation"}],"visible_if":{"question_id":"robo-001","operator":"Equals","value":{"Boolean":true}},"weight":5},{"id":"robo-003","category":"Robotics","title":"Is safety certification required?","description":"Determine whether the software must meet safety certification standards when used in robotic applications.","tooltip":"Safety certifications (ISO 13849, IEC 62443) ensure that robotic software meets minimum safety requirements.","help_text":"Consider whether ISO, IEC, or other safety standards apply to the software's use in robotics.","recommended_answer":{"Boolean":true},"legal_implications":"Using uncertified software in safety-critical robotic applications can result in liability for injuries or damages.","question_type":"Boolean","options":[],"visible_if":{"question_id":"robo-001","operator":"Equals","value":{"Boolean":true}},"weight":5},{"id":"robo-004","category":"Robotics","title":"What robotics liability terms apply?","description":"Specify the liability terms that apply when the software is used in robotic systems that may cause physical harm or property damage.","tooltip":"Robotics liability terms must address the unique risks associated with software-controlled physical systems.","help_text":"Consider whether the licensor assumes any liability for robotic system failures or if all liability is disclaimed.","recommended_answer":{"Text":"The licensor disclaims all liability for damages caused by robotic systems using the software. Users assume full responsibility for safety testing and compliance with applicable safety standards."},"legal_implications":"Robotics liability terms must account for product liability laws that may not allow full disclaimer of liability for defective products.","question_type":"Text","options":[],"visible_if":{"question_id":"robo-001","operator":"Equals","value":{"Boolean":true}},"weight":5},{"id":"iot-001","category":"Iot","title":"Is use in IoT devices permitted?","description":"Determine whether the software can be used in Internet of Things (IoT) devices and connected systems.","tooltip":"IoT use introduces connectivity, security, and data collection considerations that differ from traditional software.","help_text":"Consider whether the software is intended for IoT use or if IoT use is incidental.","recommended_answer":{"Boolean":true},"legal_implications":"IoT software may be subject to device security regulations like the EU Cyber Resilience Act and US IoT labels.","question_type":"Boolean","options":[],"visible_if":null,"weight":6},{"id":"iot-002","category":"Iot","title":"Are there IoT device restrictions?","description":"Select restrictions on the types of IoT devices or environments where the software can be deployed.","tooltip":"IoT device restrictions can limit the software to certain device categories or prevent use in high-risk environments.","help_text":"Consider whether to restrict IoT use to consumer devices, industrial devices, or medical IoT devices.","recommended_answer":{"MultiChoice":["any_device"]},"legal_implications":"IoT device restrictions must be clearly defined and enforced to prevent use in inappropriate contexts.","question_type":"MultiChoice","options":[{"label":"Any IoT device","value":"any_device","description":"No restrictions on IoT device types"},{"label":"Consumer devices only","value":"consumer","description":"Limited to consumer-grade IoT devices"},{"label":"Industrial IoT only","value":"industrial","description":"Limited to industrial and commercial IoT applications"},{"label":"No IoT use","value":"no_iot","description":"Software cannot be used in IoT devices"}],"visible_if":{"question_id":"iot-001","operator":"Equals","value":{"Boolean":true}},"weight":5},{"id":"iot-003","category":"Iot","title":"What IoT data collection terms apply?","description":"Specify the terms that govern data collection, transmission, and storage by IoT devices using the software.","tooltip":"IoT data terms must address the unique privacy and security challenges of always-connected devices.","help_text":"Consider data minimization, encryption, user consent, and data retention requirements for IoT data.","recommended_answer":{"Text":"IoT data collection must be transparent, encrypted, and minimized to what is necessary for device functionality. Users must be informed of all data collected and have opt-out rights where feasible."},"legal_implications":"IoT data collection without proper consent and security measures can violate privacy regulations and expose users to data breaches.","question_type":"Text","options":[],"visible_if":{"question_id":"iot-001","operator":"Equals","value":{"Boolean":true}},"weight":5},{"id":"iot-004","category":"Iot","title":"Are firmware update requirements included?","description":"Determine whether the license requires or encourages provision of firmware updates for IoT devices using the software.","tooltip":"Firmware update requirements help ensure that IoT devices remain secure and functional over their lifecycle.","help_text":"Consider whether updates must be provided, for how long, and whether they must be automatic or manual.","recommended_answer":{"Boolean":true},"legal_implications":"Failure to provide firmware updates for IoT devices can result in security vulnerabilities and regulatory non-compliance (e.g., EU Cyber Resilience Act).","question_type":"Boolean","options":[],"visible_if":{"question_id":"iot-001","operator":"Equals","value":{"Boolean":true}},"weight":5},{"id":"emb-001","category":"Embedded","title":"Is use in embedded systems permitted?","description":"Determine whether the software can be used in embedded systems with limited resources (memory, processing power, storage).","tooltip":"Embedded use may have different licensing needs due to resource constraints and distribution limitations.","help_text":"Consider whether the software is designed for embedded use or if embedded use requires special considerations.","recommended_answer":{"Boolean":true},"legal_implications":"Embedded use often involves static linking and binary-only distribution, which may trigger different license obligations.","question_type":"Boolean","options":[],"visible_if":null,"weight":6},{"id":"emb-002","category":"Embedded","title":"Are there embedded system restrictions?","description":"Select restrictions on the types of embedded systems or environments where the software can be deployed.","tooltip":"Embedded system restrictions can limit the software to specific device categories or prevent use in safety-critical systems.","help_text":"Consider whether to restrict embedded use to consumer electronics, industrial controllers, or automotive systems.","recommended_answer":{"MultiChoice":["any_embedded"]},"legal_implications":"Embedded system restrictions must account for the unique licensing challenges of resource-constrained environments.","question_type":"MultiChoice","options":[{"label":"Any embedded system","value":"any_embedded","description":"No restrictions on embedded system types"},{"label":"Consumer electronics only","value":"consumer","description":"Limited to consumer-grade embedded devices"},{"label":"Industrial only","value":"industrial","description":"Limited to industrial embedded applications"},{"label":"No embedded use","value":"no_embedded","description":"Software cannot be used in embedded systems"}],"visible_if":{"question_id":"emb-001","operator":"Equals","value":{"Boolean":true}},"weight":5},{"id":"emb-003","category":"Embedded","title":"What flash memory requirements apply?","description":"Specify any requirements related to how the software is stored and updated in flash memory or other non-volatile storage on embedded devices.","tooltip":"Flash memory requirements affect how the software is deployed, updated, and maintained on embedded devices.","help_text":"Consider whether over-the-air (OTA) updates, field firmware upgrades, or read-only memory deployment is required.","recommended_answer":{"Text":"The software must support standard firmware update mechanisms and must not require write access to non-volatile storage beyond what is necessary for its core functionality."},"legal_implications":"Flash memory requirements must be compatible with the embedded device's hardware capabilities and lifecycle expectations.","question_type":"Text","options":[],"visible_if":{"question_id":"emb-001","operator":"Equals","value":{"Boolean":true}},"weight":4},{"id":"emb-004","category":"Embedded","title":"What embedded license compatibility requirements apply?","description":"Select the license compatibility requirements that must be met when the software is combined with other code in embedded systems.","tooltip":"License compatibility in embedded systems is critical because static linking and binary-only distribution are common.","help_text":"Consider whether the license must be compatible with common embedded OS licenses (FreeRTOS, Zephyr, etc.).","recommended_answer":{"MultiChoice":["permissive"]},"legal_implications":"License incompatibility in embedded systems can force developers to choose between compliance and functionality.","question_type":"MultiChoice","options":[{"label":"Permissive license required","value":"permissive","description":"Software must use a permissive license compatible with proprietary embedded code"},{"label":"GPL-compatible license","value":"gpl_compatible","description":"Software license must be compatible with GPL-family licenses"},{"label":"No compatibility requirements","value":"none","description":"No specific license compatibility requirements"}],"visible_if":{"question_id":"emb-001","operator":"Equals","value":{"Boolean":true}},"weight":4},{"id":"edu-001","category":"Education","title":"Is use in educational settings permitted?","description":"Determine whether the software can be used in K-12 schools, universities, training programs, and other educational contexts.","tooltip":"Educational use exemptions help integrate software into curricula and training programs.","help_text":"Consider whether educational use covers teaching, learning, and educational research activities.","recommended_answer":{"Boolean":true},"legal_implications":"Educational use terms must be clearly defined to prevent unauthorized commercial use disguised as education.","question_type":"Boolean","options":[],"visible_if":null,"weight":6},{"id":"edu-002","category":"Education","title":"What educational institution licensing terms apply?","description":"Choose the licensing model for educational institutions using the software for teaching and learning purposes.","tooltip":"Educational licensing terms can significantly affect adoption by schools, universities, and training programs.","help_text":"Consider whether to offer free educational licenses, discounted rates, or institutional site licenses.","recommended_answer":{"Choice":"free_with_attribution"},"legal_implications":"Educational licensing terms must clearly distinguish between educational use and commercial use by the institution itself.","question_type":"Choice","options":[{"label":"Free with attribution","value":"free_with_attribution","description":"Free use if the institution properly attributes the software"},{"label":"Heavily discounted","value":"discounted","description":"Significant discount from commercial pricing"},{"label":"Full commercial pricing","value":"commercial","description":"Educational institutions pay the same as commercial users"},{"label":"Free for all educational use","value":"free","description":"Completely free for all educational purposes"}],"visible_if":{"question_id":"edu-001","operator":"Equals","value":{"Boolean":true}},"weight":5},{"id":"edu-003","category":"Education","title":"What terms apply to student projects using the software?","description":"Specify the license terms that apply when students use the software in course projects, theses, or personal learning projects.","tooltip":"Student project terms determine whether students can keep their projects and whether they can be commercialized.","help_text":"Consider whether student projects can be kept, shared, or commercialized after the course ends.","recommended_answer":{"Text":"Students may use the software freely for course projects and personal learning. Projects may be kept and shared by students; commercial use is subject to the main license terms."},"legal_implications":"Student project terms should not interfere with students' intellectual property rights in their own work.","question_type":"Text","options":[],"visible_if":{"question_id":"edu-001","operator":"Equals","value":{"Boolean":true}},"weight":4},{"id":"edu-004","category":"Education","title":"Can educational content created with the software be licensed freely?","description":"Determine whether educational materials, tutorials, courses, or documentation created using the software can be freely licensed or distributed.","tooltip":"Educational content licensing affects the ability of educators to share and remix teaching materials.","help_text":"Consider whether CC-BY, CC-BY-SA, or other open content licenses apply to educational materials.","recommended_answer":{"Choice":"any_license"},"legal_implications":"Restricting educational content licensing can limit the educational community's ability to collaborate and share resources.","question_type":"Choice","options":[{"label":"Any license permitted","value":"any_license","description":"Educational content can be licensed under any terms"},{"label":"Open content license required","value":"open_content","description":"Educational content must use an open content license (CC-BY, etc.)"},{"label":"Same license as software","value":"same_license","description":"Educational content must use the same license as the software"}],"visible_if":{"question_id":"edu-001","operator":"Equals","value":{"Boolean":true}},"weight":4},{"id":"ri-001","category":"ResearchInstitutions","title":"Are research institutions given special license terms?","description":"Determine whether accredited research institutions (universities, national labs, research centers) receive different or more permissive license terms.","tooltip":"Research institution exemptions can encourage wider academic adoption and collaboration.","help_text":"Define what qualifies as a research institution and what special terms apply.","recommended_answer":{"Boolean":true},"legal_implications":"Research institution terms must be clearly defined to prevent commercial entities from claiming research status.","question_type":"Boolean","options":[],"visible_if":null,"weight":6},{"id":"ri-002","category":"ResearchInstitutions","title":"What are the publication requirements for research institutions?","description":"Specify the requirements for publishing research results obtained using the software at research institutions.","tooltip":"Publication requirements ensure that research results are shared with the scientific community.","help_text":"Consider whether publications must acknowledge the software, include specific citations, or follow particular formats.","recommended_answer":{"Choice":"acknowledgment"},"legal_implications":"Publication requirements must be reasonable and not conflict with institutional publication policies or funding requirements.","question_type":"Choice","options":[{"label":"Formal citation required","value":"citation","description":"Must include a formal citation in all publications"},{"label":"Acknowledgment sufficient","value":"acknowledgment","description":"A general acknowledgment is sufficient"},{"label":"No publication requirements","value":"none","description":"No specific publication obligations"}],"visible_if":{"question_id":"ri-001","operator":"Equals","value":{"Boolean":true}},"weight":5},{"id":"ri-003","category":"ResearchInstitutions","title":"What research data sharing requirements apply?","description":"Choose the data sharing requirements for research data generated using the software at research institutions.","tooltip":"Research data sharing helps advance scientific knowledge and enables reproducibility of results.","help_text":"Consider whether research data must be shared with the scientific community, funding agencies, or the public.","recommended_answer":{"Choice":"open_access"},"legal_implications":"Data sharing requirements must comply with funding agency mandates and institutional data management policies.","question_type":"Choice","options":[{"label":"Open access required","value":"open_access","description":"Research data must be made publicly available"},{"label":"Upon request","value":"upon_request","description":"Data must be shared when other researchers request it"},{"label":"No data sharing requirements","value":"none","description":"No specific data sharing obligations"}],"visible_if":{"question_id":"ri-001","operator":"Equals","value":{"Boolean":true}},"weight":5},{"id":"ri-004","category":"ResearchInstitutions","title":"What are the research collaboration terms?","description":"Specify the terms that govern collaborative research projects involving multiple institutions using the software.","tooltip":"Collaboration terms help define IP ownership and licensing obligations in multi-institutional research projects.","help_text":"Consider whether joint IP ownership, licensing terms, or contribution requirements apply to collaborative research.","recommended_answer":{"Text":"Each research institution retains rights to its own contributions. Joint IP is governed by the specific collaboration agreement. All institutions receive a license to use the software and any shared research results."},"legal_implications":"Collaboration terms must be established before research begins to prevent IP disputes after results are generated.","question_type":"Text","options":[],"visible_if":{"question_id":"ri-001","operator":"Equals","value":{"Boolean":true}},"weight":4},{"id":"np-001","category":"Nonprofit","title":"Is use by nonprofit organizations permitted?","description":"Determine whether nonprofit organizations can use the software under special or standard license terms.","tooltip":"Nonprofit exemptions can encourage adoption by charitable, educational, and community organizations.","help_text":"Consider whether nonprofits receive special terms or the same terms as commercial users.","recommended_answer":{"Boolean":true},"legal_implications":"Nonprofit use terms must clearly define what qualifies as a nonprofit to prevent abuse.","question_type":"Boolean","options":[],"visible_if":null,"weight":6},{"id":"np-002","category":"Nonprofit","title":"Is nonprofit status verification required?","description":"Determine whether organizations claiming nonprofit status must provide verification (e.g., tax-exempt status documentation) to qualify for nonprofit license terms.","tooltip":"Verification prevents commercial organizations from falsely claiming nonprofit status to obtain favorable terms.","help_text":"Consider whether to require 501(c)(3) documentation, equivalent international nonprofit certification, or a signed declaration.","recommended_answer":{"Boolean":true},"legal_implications":"Without verification, the licensor may lose revenue from organizations that falsely claim nonprofit status.","question_type":"Boolean","options":[],"visible_if":{"question_id":"np-001","operator":"Equals","value":{"Boolean":true}},"weight":5},{"id":"np-003","category":"Nonprofit","title":"What nonprofit license terms should apply?","description":"Choose the license terms that apply to nonprofit organizations using the software.","tooltip":"Nonprofit license terms can range from free use to significantly discounted commercial terms.","help_text":"Consider whether to offer free licenses, discounted licenses, or the same terms as commercial users for nonprofits.","recommended_answer":{"Choice":"free_with_attribution"},"legal_implications":"Nonprofit terms must be clearly defined and consistently applied to prevent disputes about eligibility.","question_type":"Choice","options":[{"label":"Free with attribution","value":"free_with_attribution","description":"Free use if the nonprofit properly attributes the software"},{"label":"Heavily discounted","value":"discounted","description":"Significant discount from commercial pricing"},{"label":"Full commercial pricing","value":"commercial","description":"Nonprofits pay the same as commercial users"}],"visible_if":{"question_id":"np-001","operator":"Equals","value":{"Boolean":true}},"weight":5},{"id":"np-004","category":"Nonprofit","title":"Are there revenue restrictions for nonprofit license eligibility?","description":"Specify the maximum annual revenue that a nonprofit organization can have while still qualifying for nonprofit license terms.","tooltip":"Revenue restrictions prevent large, well-funded nonprofits from obtaining terms intended for smaller organizations.","help_text":"Consider revenue thresholds based on organization size and the cost of the software.","recommended_answer":{"Number":5000000},"legal_implications":"Revenue thresholds must be clearly defined and reasonable to prevent discrimination claims while protecting the licensor's interests.","question_type":"Number","options":[],"visible_if":{"question_id":"np-001","operator":"Equals","value":{"Boolean":true}},"weight":4},{"id":"fnd-001","category":"Foundation","title":"Is the software managed by a foundation?","description":"Determine whether the software is governed by a foundation or similar legal entity that oversees its development and licensing.","tooltip":"Foundation governance provides a neutral legal structure for managing open-source projects with multiple stakeholders.","help_text":"Consider whether the foundation handles licensing, trademark management, and dispute resolution.","recommended_answer":{"Boolean":false},"legal_implications":"Foundation governance must comply with nonprofit or corporate governance laws in its jurisdiction of incorporation.","question_type":"Boolean","options":[],"visible_if":null,"weight":6},{"id":"fnd-002","category":"Foundation","title":"What foundation governance requirements apply?","description":"Specify the governance structure and requirements for the foundation overseeing the software project.","tooltip":"Foundation governance determines how decisions are made about the project's direction, licensing, and community management.","help_text":"Consider board structure, voting procedures, conflict of interest policies, and membership requirements.","recommended_answer":{"Text":"Foundation operates with an elected board of directors; major decisions require supermajority vote; conflict of interest policy applies to all board members and officers."},"legal_implications":"Foundation governance must be transparent and comply with applicable nonprofit governance laws to maintain credibility and legal status.","question_type":"Text","options":[],"visible_if":{"question_id":"fnd-001","operator":"Equals","value":{"Boolean":true}},"weight":5},{"id":"fnd-003","category":"Foundation","title":"What foundation reporting obligations exist?","description":"Specify the reporting requirements that the foundation must fulfill regarding the software's development, finances, and community.","tooltip":"Foundation reporting ensures transparency and accountability to the project's stakeholders and the public.","help_text":"Consider financial reporting, annual reports, board meeting minutes, and community updates.","recommended_answer":{"Text":"Foundation publishes annual financial reports, holds open board meetings at least quarterly, and provides regular community updates on project status and roadmap."},"legal_implications":"Foundation reporting obligations may be legally required depending on the foundation's tax-exempt status and jurisdiction.","question_type":"Text","options":[],"visible_if":{"question_id":"fnd-001","operator":"Equals","value":{"Boolean":true}},"weight":4},{"id":"fnd-004","category":"Foundation","title":"What foundation trademark usage rules apply?","description":"Specify the rules governing the use of the foundation's name, logo, and trademarks by the community and commercial entities.","tooltip":"Foundation trademark rules protect the project's brand and prevent confusion between the foundation and commercial users.","help_text":"Consider whether trademarks can be used to indicate compatibility, endorsement, or affiliation with the foundation.","recommended_answer":{"Text":"Foundation trademarks may not be used to imply endorsement or affiliation without written permission. Trademarks must be used exactly as provided in the trademark guidelines. Use in derivative work names must follow the fork naming policy."},"legal_implications":"Trademark misuse can result in loss of trademark protection and allow third parties to use the marks without authorization.","question_type":"Text","options":[],"visible_if":{"question_id":"fnd-001","operator":"Equals","value":{"Boolean":true}},"weight":4},{"id":"ce-001","category":"CommercialExceptions","title":"Are there exceptions to commercial use restrictions?","description":"Determine whether certain types of commercial use are exempt from general commercial restrictions in the license.","tooltip":"Commercial exceptions allow specific types of commercial use while maintaining restrictions on others.","help_text":"Consider whether to create exceptions for internal use, small businesses, or specific industries.","recommended_answer":{"Boolean":false},"legal_implications":"Commercial exceptions must be clearly defined to prevent abuse and ensure consistent enforcement.","question_type":"Boolean","options":[],"visible_if":null,"weight":6},{"id":"ce-002","category":"CommercialExceptions","title":"What exception categories exist?","description":"Select the categories of commercial use that are exempt from general commercial restrictions.","tooltip":"Exception categories define which types of commercial activities can proceed without a separate commercial license.","help_text":"Consider exceptions for small businesses, startups, open-source projects, educational institutions, and nonprofits.","recommended_answer":{"MultiChoice":["small_business","open_source_projects"]},"legal_implications":"Exception categories must be clearly defined with verifiable criteria to prevent gaming of the exception system.","question_type":"MultiChoice","options":[{"label":"Small business exception","value":"small_business","description":"Companies below a revenue threshold are exempt from commercial restrictions"},{"label":"Startup exception","value":"startup","description":"Recently funded startups receive a grace period before commercial restrictions apply"},{"label":"Open-source project exception","value":"open_source_projects","description":"Projects that are themselves open source are exempt"},{"label":"Internal tool exception","value":"internal_tools","description":"Use as an internal tool (not sold to customers) is exempt"}],"visible_if":{"question_id":"ce-001","operator":"Equals","value":{"Boolean":true}},"weight":5},{"id":"ce-003","category":"CommercialExceptions","title":"What is the exception approval process?","description":"Specify the process by which organizations can apply for or qualify for commercial use exceptions.","tooltip":"A clear approval process ensures that exceptions are granted fairly and consistently.","help_text":"Consider whether exceptions are automatic (based on criteria), application-based, or granted at the licensor's discretion.","recommended_answer":{"Text":"Small business and open-source exceptions are automatic if the organization meets the published criteria. Other exceptions require a written application to the licensor, with a response within 30 business days."},"legal_implications":"The approval process must be documented and applied consistently to prevent discrimination claims.","question_type":"Text","options":[],"visible_if":{"question_id":"ce-001","operator":"Equals","value":{"Boolean":true}},"weight":5},{"id":"ce-004","category":"CommercialExceptions","title":"How long do commercial exceptions last?","description":"Specify the duration and renewal requirements for commercial use exceptions once they are granted.","tooltip":"Exception duration determines how long organizations can rely on the exception before needing to renew or transition to a commercial license.","help_text":"Consider whether exceptions are permanent, time-limited, or subject to periodic review.","recommended_answer":{"Choice":"annual_review"},"legal_implications":"Exception duration must balance the needs of organizations relying on the exception with the licensor's right to adjust terms.","question_type":"Choice","options":[{"label":"Annual review required","value":"annual_review","description":"Exceptions must be re-verified annually based on current criteria"},{"label":"Permanent once granted","value":"permanent","description":"Once granted, the exception does not expire"},{"label":"Time-limited (2 years)","value":"2_years","description":"Exceptions expire after 2 years and must be renewed"}],"visible_if":{"question_id":"ce-001","operator":"Equals","value":{"Boolean":true}},"weight":4},{"id":"sp-001","category":"SpecialPermissions","title":"Are special permissions available for non-standard use cases?","description":"Determine whether the licensor offers special permissions or variances for use cases that fall outside the standard license terms.","tooltip":"Special permissions provide flexibility for unique use cases that cannot be accommodated by the standard license.","help_text":"Consider whether the licensor has a process for evaluating and granting special permission requests.","recommended_answer":{"Boolean":true},"legal_implications":"Special permission processes must be documented and applied consistently to prevent claims of arbitrary or discriminatory treatment.","question_type":"Boolean","options":[],"visible_if":null,"weight":5},{"id":"sp-002","category":"SpecialPermissions","title":"What is the special permission request process?","description":"Specify the steps that organizations must follow to request special permissions for non-standard use cases.","tooltip":"A clear request process ensures that special permission requests are handled efficiently and fairly.","help_text":"Consider whether requests must be submitted in writing, include specific information, or follow a particular format.","recommended_answer":{"Text":"Special permission requests must be submitted in writing to the licensor, including: (1) description of the intended use, (2) why standard license terms cannot be met, (3) proposed alternative terms, and (4) organizational information. Licensor will respond within 45 business days."},"legal_implications":"The request process must be reasonable and not create unnecessary barriers for legitimate special permission requests.","question_type":"Text","options":[],"visible_if":{"question_id":"sp-001","operator":"Equals","value":{"Boolean":true}},"weight":5},{"id":"sp-003","category":"SpecialPermissions","title":"What are the special permission approval criteria?","description":"Specify the criteria used to evaluate and approve or deny special permission requests.","tooltip":"Clear approval criteria ensure that special permission decisions are consistent, transparent, and legally defensible.","help_text":"Consider whether approvals are based on use case merit, organizational reputation, licensing precedent, or other factors.","recommended_answer":{"Text":"Special permissions are evaluated based on: (1) consistency with the project's mission and values, (2) potential impact on the community and ecosystem, (3) legal and regulatory compliance, (4) precedent set by prior permissions, and (5) benefit to the broader community."},"legal_implications":"Approval criteria must be consistently applied to prevent claims of bias, favoritism, or arbitrary decision-making.","question_type":"Text","options":[],"visible_if":{"question_id":"sp-001","operator":"Equals","value":{"Boolean":true}},"weight":4},{"id":"sp-004","category":"SpecialPermissions","title":"What are the special permission revocation terms?","description":"Specify the conditions under which a previously granted special permission can be revoked by the licensor.","tooltip":"Revocation terms protect the licensor's ability to withdraw special permissions if circumstances change or terms are violated.","help_text":"Consider whether revocation can occur for cause only, at will, or under specific circumstances.","recommended_answer":{"Text":"Special permissions may be revoked with 90 days written notice if: (1) the permission is being used outside its approved scope, (2) the underlying circumstances have materially changed, (3) the permission holder breaches any terms of the permission grant, or (4) revocation is necessary to protect the project's mission or community. Licensees receive a transition period to come into compliance or obtain alternative licensing."},"legal_implications":"Revocation terms must balance the licensor's right to manage special permissions with the licensee's reasonable expectations and reliance interests.","question_type":"Text","options":[],"visible_if":{"question_id":"sp-001","operator":"Equals","value":{"Boolean":true}},"weight":4},{"id":"own-006","category":"Ownership","title":"Is joint ownership documented in a written agreement?","description":"Determine whether the joint ownership arrangement between copyright holders is documented in a formal written agreement.","tooltip":"Written agreements prevent disputes about ownership rights, licensing authority, and revenue sharing.","help_text":"A joint ownership agreement should specify each party's rights, licensing authority, and dispute resolution procedures.","recommended_answer":{"Boolean":true},"legal_implications":"Without a written agreement, joint ownership disputes can lead to prolonged litigation and uncertain licensing authority.","question_type":"Boolean","options":[],"visible_if":{"question_id":"own-002","operator":"Equals","value":{"Boolean":true}},"weight":6},{"id":"attr-005","category":"Attribution","title":"Is attribution required in binary distributions?","description":"Determine whether binary distributions of the software must include attribution information in the binary itself or accompanying files.","tooltip":"Binary attribution ensures that end users who only receive compiled code can still identify the original authors.","help_text":"Consider whether attribution should be embedded in the binary, included in an about dialog, or shipped as a separate file.","recommended_answer":{"Boolean":true},"legal_implications":"Omitting attribution from binary distributions can violate the license terms and deprive authors of recognition.","question_type":"Boolean","options":[],"visible_if":{"question_id":"attr-001","operator":"Equals","value":{"Boolean":true}},"weight":6},{"id":"noti-005","category":"Notice","title":"Are change notices required for modifications?","description":"Determine whether licensees must include notices describing any changes they make to the original software.","tooltip":"Change notices help downstream users understand how the software has been modified from the original version.","help_text":"Consider whether a changelog, file-level comments, or a NOTICE file is sufficient for documenting modifications.","recommended_answer":{"Boolean":true},"legal_implications":"Change notices help maintain transparency in the software supply chain and prevent confusion about which version is in use.","question_type":"Boolean","options":[],"visible_if":{"question_id":"mod-001","operator":"Equals","value":{"Boolean":true}},"weight":5},{"id":"war-005","category":"Warranty","title":"Is there a warranty for third-party components?","description":"Determine whether the warranty (or warranty disclaimer) extends to third-party components, libraries, or dependencies included with the software.","tooltip":"Third-party component warranties affect the overall warranty coverage of the distributed software package.","help_text":"Consider whether the licensor assumes any responsibility for the quality or security of third-party dependencies.","recommended_answer":{"Boolean":false},"legal_implications":"Extending warranty to third-party components exposes the licensor to liability for code they did not write or control.","question_type":"Boolean","options":[],"visible_if":null,"weight":6},{"id":"dw-005","category":"DerivativeWorks","title":"Are plugins and extensions considered derivative works?","description":"Determine whether plugins, extensions, add-ons, or modules created for the software are classified as derivative works under the license.","tooltip":"Plugin classification affects the license obligations for the broader ecosystem of extensions and integrations.","help_text":"Consider whether plugins that use public APIs are derivative works vs. independent works that merely interface with the software.","recommended_answer":{"Choice":"depends_on_api"},"legal_implications":"The plugin classification question directly affects whether the plugin ecosystem must use the same license or can use any license.","question_type":"Choice","options":[{"label":"Depends on API usage","value":"depends_on_api","description":"Plugins using public APIs are not derivative works; those using internal APIs are"},{"label":"All plugins are derivatives","value":"all_derivatives","description":"All plugins and extensions are considered derivative works"},{"label":"No plugins are derivatives","value":"no_derivatives","description":"Plugins and extensions are independent works regardless of API usage"}],"visible_if":{"question_id":"dw-001","operator":"Equals","value":{"Boolean":true}},"weight":6},{"id":"ai-005","category":"AiTraining","title":"Must AI training provenance be documented?","description":"Determine whether AI models trained using this software must document the provenance (origin and training process) of the resulting models.","tooltip":"Training provenance documentation helps trace the lineage of AI models and ensures proper credit to upstream sources.","help_text":"Consider whether provenance documentation must include the specific version of the software used, training data sources, and training methodology.","recommended_answer":{"Boolean":true},"legal_implications":"Provenance documentation requirements should be practical and not so burdensome as to discourage legitimate AI research use.","question_type":"Boolean","options":[],"visible_if":{"question_id":"ai-001","operator":"NotEquals","value":{"Choice":"not_permitted"}},"weight":5},{"id":"privy-005","category":"Privacy","title":"What data breach notification requirements apply?","description":"Specify the requirements for notifying affected parties and regulators in the event of a data breach involving personal data processed by the software.","tooltip":"Data breach notification requirements are mandated by most privacy regulations and must be addressed in the license.","help_text":"Consider notification timelines (e.g., 72 hours under GDPR), notification recipients, and required content of breach notifications.","recommended_answer":{"Text":"In the event of a data breach involving personal data, the affected party must notify the relevant data protection authority within 72 hours and affected individuals without undue delay, as required by applicable data protection laws."},"legal_implications":"Failure to comply with data breach notification requirements can result in significant fines under GDPR (up to 2% of global annual turnover) and other regulations.","question_type":"Text","options":[],"visible_if":{"question_id":"privy-001","operator":"Equals","value":{"Boolean":true}},"weight":6}],"clauses":[{"uuid":"c0000001-0000-0000-0000-000000000001","name":"MIT-PERMISSION","description":"MIT standard permission grant","version":"1.0.0","category":"permission","dependencies":[],"conflicts":["NO-COMMERCIAL","RESTRICTED-USE"],"priority":100,"template":"Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the \"Software\"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:","variables":["year","copyright_holder"]},{"uuid":"c0000001-0000-0000-0000-000000000002","name":"MIT-CONDITION","description":"MIT standard copyright notice condition","version":"1.0.0","category":"condition","dependencies":["MIT-PERMISSION"],"conflicts":[],"priority":100,"template":"The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.","variables":[]},{"uuid":"c0000001-0000-0000-0000-000000000003","name":"MIT-WARRANTY","description":"MIT standard warranty disclaimer","version":"1.0.0","category":"warranty","dependencies":[],"conflicts":[],"priority":100,"template":"THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.","variables":[]},{"uuid":"c0000002-0000-0000-0000-000000000001","name":"APACHE-PERMISSION","description":"Apache 2.0 standard permission grant","version":"2.0.0","category":"permission","dependencies":[],"conflicts":["NO-COMMERCIAL"],"priority":100,"template":"Licensed under the Apache License, Version 2.0 (the \"License\"); you may not use this file except in compliance with the License. You may obtain a copy of the License at\n\n    http://www.apache.org/licenses/LICENSE-2.0\n\nUnless required by applicable law or agreed to in writing, software distributed under the License is distributed on an \"AS IS\" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.","variables":[]},{"uuid":"c0000002-0000-0000-0000-000000000002","name":"APACHE-PATENT","description":"Apache 2.0 patent grant","version":"2.0.0","category":"patent","dependencies":["APACHE-PERMISSION"],"conflicts":["NO-PATENT-GRANT"],"priority":100,"template":"Subject to the terms and conditions of this License, each Contributor hereby grants to You a perpetual, worldwide, non-exclusive, no-charge, royalty-free, irrevocable patent license to make, have made, use, offer to sell, sell, import, and otherwise transfer the Work, where such license applies only to those patent claims, both owned or controlled by the Contributor, that are necessarily infringed by their Contribution(s) alone or by combination of their Contribution(s) with the Work to which such Contribution(s) was submitted.","variables":[]},{"uuid":"c0000003-0000-0000-0000-000000000001","name":"GPL-COPYLEFT","description":"GPL standard copyleft requirement","version":"3.0.0","category":"condition","dependencies":[],"conflicts":["NO-COPYLEFT","PROPRIETARY"],"priority":200,"template":"You may convey a work based on the Program, or the modifications to produce it from the Program, in the form of source code, provided that you also meet all of these conditions:\n\na) The work must carry prominent notices stating that you modified it and giving a relevant date.\nb) The work must be licensed as a whole under this License to anyone who comes into possession of a copy.\nc) If the work has interactive user interfaces, each must display an appropriate legal notice.","variables":[]},{"uuid":"c0000004-0000-0000-0000-000000000001","name":"BSD-2-PERMISSION","description":"BSD 2-Clause permission grant","version":"2.0.0","category":"permission","dependencies":[],"conflicts":["NO-COMMERCIAL"],"priority":100,"template":"Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:\n\n1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.\n2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.","variables":[]},{"uuid":"c0000004-0000-0000-0000-000000000002","name":"BSD-2-DISCLAIMER","description":"BSD 2-Clause disclaimer","version":"2.0.0","category":"warranty","dependencies":[],"conflicts":[],"priority":100,"template":"THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS \"AS IS\" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.","variables":[]},{"uuid":"c0000005-0000-0000-0000-000000000001","name":"BSD-3-ADVERTISING","description":"BSD 3-Clause advertising clause","version":"3.0.0","category":"condition","dependencies":["BSD-2-PERMISSION"],"conflicts":[],"priority":110,"template":"3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.","variables":[]},{"uuid":"c0000006-0000-0000-0000-000000000001","name":"ISC-PERMISSION","description":"ISC License permission grant","version":"1.0.0","category":"permission","dependencies":[],"conflicts":["NO-COMMERCIAL"],"priority":100,"template":"Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.","variables":[]},{"uuid":"c0000006-0000-0000-0000-000000000002","name":"ISC-DISCLAIMER","description":"ISC License disclaimer","version":"1.0.0","category":"warranty","dependencies":[],"conflicts":[],"priority":100,"template":"THE SOFTWARE IS PROVIDED \"AS IS\" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.","variables":[]},{"uuid":"c0000007-0000-0000-0000-000000000001","name":"UNLICENSE","description":"The Unlicense public domain dedication","version":"1.0.0","category":"permission","dependencies":[],"conflicts":["COPYRIGHT-ONLY","PROPRIETARY","COMMERCIAL-EXCEPTION"],"priority":200,"template":"This is free and unencumbered software released into the public domain.\n\nAnyone is free to copy, modify, publish, use, compile, sell, or distribute this software, either in source code form or as a compiled binary, for any purpose, commercial or non-commercial, and by any means.\n\nIn jurisdictions that recognize copyright laws, the author or authors of this software dedicate any and all copyright interest in the software to the public domain. We make this dedication for the benefit of the public at large and to the detriment of our heirs and successors. We intend this dedication to be an overt act of relinquishment in perpetuity of all present and future rights to this software under copyright law.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n\nFor more information, please refer to <https://unlicense.org/>","variables":[]},{"uuid":"c0000008-0000-0000-0000-000000000001","name":"CC0-PERMISSION","description":"CC0 public domain dedication","version":"1.0.0","category":"permission","dependencies":[],"conflicts":["COPYRIGHT-ONLY","PROPRIETARY"],"priority":200,"template":"The person who associated a work with this deed has dedicated the work to the public domain by waiving all of his or her rights to the work worldwide under copyright law, including all related and neighboring rights, to the extent allowed by law.\n\nYou can copy, modify, distribute and perform the work, even for commercial purposes, all without asking permission.","variables":[]},{"uuid":"c0000009-0000-0000-0000-000000000001","name":"MPL-CONDITION","description":"MPL 2.0 file-level copyleft","version":"2.0.0","category":"condition","dependencies":[],"conflicts":["PROPRIETARY"],"priority":150,"template":"If you display Source Code, you must also display the Executable Form thereof. If the Modified Version includes Source Code, you must also include the Notice in each file of the Source Code, and include a copy of this License in the Source Code.\n\nThe Modified Software shall not include any code which is covered by this License, unless expressly included in the Source Code.","variables":[]},{"uuid":"c0000010-0000-0000-0000-000000000001","name":"LGPL-STATIC","description":"LGPL static linking exception","version":"3.0.0","category":"condition","dependencies":[],"conflicts":["PROPRIETARY"],"priority":150,"template":"As a special exception, the copyright holders of this library give you permission to combine this library with independent programs to produce an executable, regardless of the license terms of these independent programs, and to copy and distribute the resulting executable under terms of your choice, provided that you also meet, for each linked independent program, the terms and conditions of the license of that program.","variables":[]},{"uuid":"c0000011-0000-0000-0000-000000000001","name":"PATENT-RETALIATION","description":"Patent retaliation clause","version":"1.0.0","category":"patent","dependencies":[],"conflicts":[],"priority":50,"template":"If you initiate patent litigation against any entity (including a cross-claim or counterclaim in a lawsuit) alleging that the Program or a contribution incorporated within the Program constitutes direct or contributory patent infringement, then any patent licenses granted to you under this License for that Program shall terminate as of the date such litigation is filed.","variables":[]},{"uuid":"c0000012-0000-0000-0000-000000000001","name":"NO-COMMERCIAL","description":"Non-commercial use restriction","version":"1.0.0","category":"restriction","dependencies":[],"conflicts":["MIT-PERMISSION","BSD-2-PERMISSION","ISC-PERMISSION","APACHE-PERMISSION"],"priority":200,"template":"This software is provided solely for non-commercial purposes. Any commercial use of this software, in whole or in part, requires a separate commercial license from the copyright holder.","variables":["commercial_contact"]},{"uuid":"c0000013-0000-0000-0000-000000000001","name":"ATTRIBUTION","description":"Attribution requirement clause","version":"1.0.0","category":"condition","dependencies":[],"conflicts":[],"priority":50,"template":"Redistributions of source code must retain the above copyright notice, this list of conditions and the following attribution: \"{project_name}\" created by {copyright_holder}.","variables":["project_name","copyright_holder"]},{"uuid":"c0000014-0000-0000-0000-000000000001","name":"NO-TRADemark","description":"Trademark use restriction","version":"1.0.0","category":"restriction","dependencies":[],"conflicts":[],"priority":50,"template":"This License does not grant permission to use the trade names, trademarks, service marks, or product names of the licensor, except as required for reasonable and customary use in describing the origin of the work and reproducing the content of the notice file.","variables":[]},{"uuid":"c0000015-0000-0000-0000-000000000001","name":"SOURCE-DISCLOSURE","description":"Source code disclosure requirement","version":"1.0.0","category":"condition","dependencies":[],"conflicts":["PROPRIETARY"],"priority":100,"template":"If you distribute this software in executable form, you must make the complete corresponding source code available to recipients, under the same license.","variables":[]},{"uuid":"c0000016-0000-0000-0000-000000000001","name":"NETWORK-COPYLEFT","description":"Network use copyleft (SaaS/AGPL-style)","version":"3.0.0","category":"condition","dependencies":[],"conflicts":["PROPRIETARY","NO-COPYLEFT"],"priority":200,"template":"If you modify this program and use it over a network, you must make the complete corresponding source code available to users interacting with the modified version over the network.","variables":[]},{"uuid":"c0000017-0000-0000-0000-000000000001","name":"COPYRIGHT-NOTICE","description":"Copyright notice requirement","version":"1.0.0","category":"condition","dependencies":[],"conflicts":[],"priority":50,"template":"Copyright (c) {year} {copyright_holder}\n\nAll rights reserved.","variables":["year","copyright_holder"]},{"uuid":"c0000018-0000-0000-0000-000000000001","name":"DUAL-LICENSE","description":"Dual licensing notice","version":"1.0.0","category":"meta","dependencies":[],"conflicts":["SINGLE-LICENSE"],"priority":150,"template":"This software is dual-licensed under {license_a} and {license_b}. You may choose either license for your use.","variables":["license_a","license_b"]},{"uuid":"c0000019-0000-0000-0000-000000000001","name":"BUSL-RESTRICTION","description":"Business Source License use restriction","version":"1.1.0","category":"restriction","dependencies":[],"conflicts":[],"priority":200,"template":"You may not use the Software except for Non-Production Use. \"Non-Production Use\" means use of the Software for personal, internal company, research, evaluation, or educational purposes. Any production use requires a separate commercial license.","variables":["change_date","change_license"]},{"uuid":"c0000020-0000-0000-0000-000000000001","name":"SSPL-CONDITION","description":"Server Side Public License condition","version":"1.0.0","category":"condition","dependencies":[],"conflicts":["PROPRIETARY"],"priority":250,"template":"If you offer a hosted or managed service that uses or exposes the functionality of the Program, you must make the Complete Source Code available to every user of that service, under this License.","variables":[]},{"uuid":"c0000021-0000-0000-0000-000000000001","name":"POLYFORM-RESTRICTION","description":"PolyForm Project use restriction","version":"1.0.0","category":"restriction","dependencies":[],"conflicts":[],"priority":200,"template":"You may use the Software only for {allowed_uses}. Any other use requires a separate commercial license from the copyright holder.","variables":["allowed_uses"]},{"uuid":"c0000022-0000-0000-0000-000000000001","name":"AI-TRAINING-RESTRICTION","description":"Restriction on AI/ML training use","version":"1.0.0","category":"restriction","dependencies":[],"conflicts":[],"priority":100,"template":"You may not use this software, in whole or in part, for training, fine-tuning, or otherwise improving machine learning models, artificial intelligence systems, or similar computational systems without express written permission from the copyright holder.","variables":[]},{"uuid":"c0000023-0000-0000-0000-000000000001","name":"EXPORT-CONTROL","description":"Export control compliance clause","version":"1.0.0","category":"compliance","dependencies":[],"conflicts":[],"priority":50,"template":"You agree to comply with all applicable export control laws and regulations, including but not limited to the Export Administration Regulations (EAR) and sanctions programs administered by the Office of Foreign Assets Control (OFAC).","variables":[]},{"uuid":"c0000024-0000-0000-0000-000000000001","name":"TERMINATION","description":"License termination on breach","version":"1.0.0","category":"termination","dependencies":[],"conflicts":[],"priority":50,"template":"This License and the rights granted hereunder will terminate automatically if you fail to comply with any of its terms. Upon termination, you must cease all use of the Software and destroy all copies.","variables":[]},{"uuid":"c0000025-0000-0000-0000-000000000001","name":"REVISION","description":"Revision clause allowing license updates","version":"1.0.0","category":"meta","dependencies":[],"conflicts":[],"priority":50,"template":"The copyright holder reserves the right to issue new versions of this License. No one has the right to modify this License as applied to the Program.","variables":[]},{"uuid":"c0000026-0000-0000-0000-000000000001","name":"GOVERNMENT-USE","description":"Government use rights","version":"1.0.0","category":"permission","dependencies":[],"conflicts":[],"priority":50,"template":"U.S. Government users are granted a non-exclusive, royalty-free license with no restrictions on use, reproduction, or modification, consistent with applicable law.","variables":[]},{"uuid":"c0000027-0000-0000-0000-000000000001","name":"CONTRIBUTION-CLA","description":"Contributor License Agreement clause","version":"1.0.0","category":"meta","dependencies":[],"conflicts":[],"priority":50,"template":"By submitting a pull request or other contribution, you agree to the terms of the Contributor License Agreement (CLA) available at {cla_url}, and you certify that you have the right to grant the licenses in the CLA.","variables":["cla_url"]},{"uuid":"c0000028-0000-0000-0000-000000000001","name":"DRM-RESTRICTION","description":"DRM/circumvention clause","version":"1.0.0","category":"restriction","dependencies":[],"conflicts":[],"priority":50,"template":"You may not circumvent, disable, or otherwise interfere with security-related features of the Software, including features that prevent or restrict use or copying.","variables":[]},{"uuid":"c0000029-0000-0000-0000-000000000001","name":"SUBSCRIPTION-LICENSE","description":"Subscription-based usage","version":"1.0.0","category":"commercial","dependencies":[],"conflicts":[],"priority":100,"template":"This software is licensed on a subscription basis. Your license is valid for the duration of your active subscription. Upon expiration or termination, your rights to use the software cease immediately.","variables":["subscription_period","pricing"]},{"uuid":"c0000030-0000-0000-0000-000000000001","name":"EVALUATION-LICENSE","description":"Evaluation/trial license","version":"1.0.0","category":"commercial","dependencies":[],"conflicts":[],"priority":100,"template":"This software is provided for evaluation purposes only for a period of {evaluation_days} days from the date of acquisition. After the evaluation period, you must obtain a full license to continue use.","variables":["evaluation_days"]},{"uuid":"c0000031-0000-0000-0000-000000000001","name":"OPEN-CORE","description":"Open core licensing model","version":"1.0.0","category":"commercial","dependencies":[],"conflicts":[],"priority":100,"template":"The core components of this software are licensed under {core_license}. Enterprise features, as defined in the features manifest, are available under a separate commercial license.","variables":["core_license","features_url"]},{"uuid":"c0000032-0000-0000-0000-000000000001","name":"TELEMETRY-NOTICE","description":"Telemetry/data collection notice","version":"1.0.0","category":"privacy","dependencies":[],"conflicts":["PRIVACY-NO-TELEMETRY"],"priority":50,"template":"This software may collect usage telemetry and diagnostic data to improve product quality. You may opt out by setting telemetry_enabled=false in the configuration.","variables":[]},{"uuid":"c0000033-0000-0000-0000-000000000001","name":"HEALTHCARE-RESTRICTION","description":"HIPAA/healthcare compliance restriction","version":"1.0.0","category":"compliance","dependencies":[],"conflicts":[],"priority":50,"template":"This software has not been certified for use in healthcare or medical device applications. It is not compliant with HIPAA, FDA, or other healthcare regulatory requirements.","variables":[]},{"uuid":"c0000034-0000-0000-0000-000000000001","name":"NUCLEAR-RESTRICTION","description":"Nuclear facility use restriction","version":"1.0.0","category":"compliance","dependencies":[],"conflicts":[],"priority":50,"template":"This software is not designed, tested, or certified for use in nuclear facilities, nuclear weapons, or any application where failure could result in death, personal injury, or environmental damage.","variables":[]},{"uuid":"c0000035-0000-0000-0000-000000000001","name":"MILITARY-RESTRICTION","description":"Military/defense use restriction","version":"1.0.0","category":"compliance","dependencies":[],"conflicts":[],"priority":50,"template":"This software may not be used for military, defense, weapons, or intelligence applications without express written permission from the copyright holder.","variables":[]},{"uuid":"c0000036-0000-0000-0000-000000000001","name":"DERIVATIVE-WORKS-ALLOW","description":"Permission to create derivative works","version":"1.0.0","category":"permission","dependencies":[],"conflicts":["NO-DERIVATIVES"],"priority":50,"template":"You are permitted to create derivative works based on this software, subject to the terms and conditions of this License.","variables":[]},{"uuid":"c0000037-0000-0000-0000-000000000001","name":"NO-DERIVATIVES","description":"Restriction on derivative works","version":"1.0.0","category":"restriction","dependencies":[],"conflicts":["DERIVATIVE-WORKS-ALLOW","GPL-COPYLEFT","MIT-PERMISSION","BSD-2-PERMISSION","ISC-PERMISSION"],"priority":200,"template":"You may not modify, adapt, or create derivative works based on this software without express written permission from the copyright holder.","variables":[]},{"uuid":"c0000038-0000-0000-0000-000000000001","name":"PER-SEAT-LICENSE","description":"Per-seat licensing model","version":"1.0.0","category":"commercial","dependencies":[],"conflicts":[],"priority":100,"template":"This license grants use rights for a maximum of {max_seats} named users. Additional users require additional licenses.","variables":["max_seats"]},{"uuid":"c0000039-0000-0000-0000-000000000001","name":"PER-COMPANY-LICENSE","description":"Per-company licensing model","version":"1.0.0","category":"commercial","dependencies":[],"conflicts":[],"priority":100,"template":"This license is granted for use by a single company and its direct subsidiaries as defined in the license agreement. Use by separate legal entities requires a separate license.","variables":["company_name"]},{"uuid":"c0000040-0000-0000-0000-000000000001","name":"RESALE-RESTRICTION","description":"Restriction on reselling","version":"1.0.0","category":"restriction","dependencies":[],"conflicts":[],"priority":50,"template":"You may not resell, sublicense, or distribute this software as a standalone product or as part of a commercial offering without a separate reseller agreement.","variables":[]},{"uuid":"c0000041-0000-0000-0000-000000000001","name":"CLOUD-HOSTING","description":"Cloud hosting permission","version":"1.0.0","category":"permission","dependencies":[],"conflicts":[],"priority":50,"template":"You are permitted to host and run this software on cloud infrastructure, subject to the terms of this License and applicable cloud provider agreements.","variables":[]},{"uuid":"c0000042-0000-0000-0000-000000000001","name":"CONTAINER-RIGHTS","description":"Containerization rights","version":"1.0.0","category":"permission","dependencies":[],"conflicts":[],"priority":50,"template":"You are permitted to package, distribute, and deploy this software in containerized environments including Docker, Kubernetes, and similar orchestration platforms.","variables":[]},{"uuid":"c0000043-0000-0000-0000-000000000001","name":"OEM-LICENSE","description":"OEM bundling license","version":"1.0.0","category":"commercial","dependencies":[],"conflicts":[],"priority":100,"template":"Original Equipment Manufacturer (OEM) distribution rights require a separate OEM license agreement. Contact {oem_contact} for OEM licensing terms.","variables":["oem_contact"]},{"uuid":"c0000044-0000-0000-0000-000000000001","name":"WARRANTY-PROVIDED","description":"Limited warranty provision","version":"1.0.0","category":"warranty","dependencies":[],"conflicts":["MIT-WARRANTY","BSD-2-DISCLAIMER","ISC-DISCLAIMER"],"priority":200,"template":"The copyright holder warrants that the Software will perform substantially in accordance with its documentation for a period of {warranty_days} days from the date of delivery.","variables":["warranty_days"]},{"uuid":"c0000045-0000-0000-0000-000000000001","name":"LIABILITY-CAPPED","description":"Limited liability clause","version":"1.0.0","category":"liability","dependencies":[],"conflicts":[],"priority":50,"template":"In no event shall the copyright holder be liable for any indirect, incidental, special, exemplary, or consequential damages. The total liability shall not exceed the amount paid for the software.","variables":[]},{"uuid":"c0000046-0000-0000-0000-000000000001","name":"EXPIRATION","description":"License expiration clause","version":"1.0.0","category":"termination","dependencies":[],"conflicts":[],"priority":50,"template":"This license expires on {expiration_date}. To continue use, you must obtain a renewed license from the copyright holder.","variables":["expiration_date"]},{"uuid":"c0000047-0000-0000-0000-000000000001","name":"PRIVACY-NO-TELEMETRY","description":"No telemetry privacy guarantee","version":"1.0.0","category":"privacy","dependencies":[],"conflicts":["TELEMETRY-NOTICE"],"priority":50,"template":"This software does not collect, transmit, or report any usage data, telemetry, or diagnostic information. Your privacy is fully preserved.","variables":[]},{"uuid":"c0000048-0000-0000-0000-000000000001","name":"EDUCATION-EXCEPTION","description":"Educational use exception","version":"1.0.0","category":"permission","dependencies":[],"conflicts":[],"priority":50,"template":"Educational institutions may use this software for teaching, research, and non-commercial academic purposes without additional licensing fees.","variables":[]},{"uuid":"c0000049-0000-0000-0000-000000000001","name":"NONPROFIT-EXCEPTION","description":"Non-profit organization exception","version":"1.0.0","category":"permission","dependencies":[],"conflicts":[],"priority":50,"template":"Registered non-profit organizations may use this software at no cost for their non-commercial activities, provided they comply with all other terms of this License.","variables":[]},{"uuid":"c0000050-0000-0000-0000-000000000001","name":"COMMERICAL-EXCEPTION","description":"Commercial use exception for otherwise restrictive licenses","version":"1.0.0","category":"commercial","dependencies":[],"conflicts":[],"priority":50,"template":"Notwithstanding any other terms, commercial use is permitted provided that {commercial_conditions}.","variables":["commercial_conditions"]}],"spdx":[{"id":"MIT","name":"MIT License","osi_approved":true,"fsf_free_software":true,"category":"Permissive"},{"id":"Apache-2.0","name":"Apache License 2.0","osi_approved":true,"fsf_free_software":true,"category":"Permissive"},{"id":"GPL-2.0-only","name":"GNU General Public License v2.0 only","osi_approved":true,"fsf_free_software":true,"category":"Copyleft"},{"id":"GPL-2.0-or-later","name":"GNU General Public License v2.0 or later","osi_approved":true,"fsf_free_software":true,"category":"Copyleft"},{"id":"GPL-3.0-only","name":"GNU General Public License v3.0 only","osi_approved":true,"fsf_free_software":true,"category":"Copyleft"},{"id":"GPL-3.0-or-later","name":"GNU General Public License v3.0 or later","osi_approved":true,"fsf_free_software":true,"category":"Copyleft"},{"id":"LGPL-2.1-only","name":"GNU Lesser General Public License v2.1 only","osi_approved":true,"fsf_free_software":true,"category":"Copyleft"},{"id":"LGPL-2.1-or-later","name":"GNU Lesser General Public License v2.1 or later","osi_approved":true,"fsf_free_software":true,"category":"Copyleft"},{"id":"LGPL-3.0-only","name":"GNU Lesser General Public License v3.0 only","osi_approved":true,"fsf_free_software":true,"category":"Copyleft"},{"id":"LGPL-3.0-or-later","name":"GNU Lesser General Public License v3.0 or later","osi_approved":true,"fsf_free_software":true,"category":"Copyleft"},{"id":"BSD-2-Clause","name":"BSD 2-Clause 'Simplified' License","osi_approved":true,"fsf_free_software":true,"category":"Permissive"},{"id":"BSD-3-Clause","name":"BSD 3-Clause 'New' or 'Revised' License","osi_approved":true,"fsf_free_software":true,"category":"Permissive"},{"id":"BSD-4-Clause","name":"BSD 4-Clause 'Original' or 'Old' License","osi_approved":false,"fsf_free_software":true,"category":"Permissive"},{"id":"ISC","name":"ISC License","osi_approved":true,"fsf_free_software":true,"category":"Permissive"},{"id":"MPL-2.0","name":"Mozilla Public License 2.0","osi_approved":true,"fsf_free_software":true,"category":"Weakly Copyleft"},{"id":"AGPL-3.0-only","name":"GNU Affero General Public License v3.0 only","osi_approved":true,"fsf_free_software":true,"category":"Copyleft"},{"id":"AGPL-3.0-or-later","name":"GNU Affero General Public License v3.0 or later","osi_approved":true,"fsf_free_software":true,"category":"Copyleft"},{"id":"Unlicense","name":"The Unlicense","osi_approved":true,"fsf_free_software":true,"category":"Public Domain"},{"id":"0BSD","name":"Zero-Clause BSD License","osi_approved":true,"fsf_free_software":true,"category":"Permissive"},{"id":"CC0-1.0","name":"Creative Commons Zero v1.0 Universal","osi_approved":true,"fsf_free_software":true,"category":"Public Domain"},{"id":"CC-BY-4.0","name":"Creative Commons Attribution 4.0 International","osi_approved":true,"fsf_free_software":true,"category":"Permissive"},{"id":"CC-BY-SA-4.0","name":"Creative Commons Attribution Share Alike 4.0 International","osi_approved":true,"fsf_free_software":true,"category":"Copyleft"},{"id":"Zlib","name":"zlib License","osi_approved":true,"fsf_free_software":true,"category":"Permissive"},{"id":"Artistic-2.0","name":"Artistic License 2.0","osi_approved":true,"fsf_free_software":true,"category":"Permissive"},{"id":"BSL-1.0","name":"Boost Software License 1.0","osi_approved":true,"fsf_free_software":false,"category":"Permissive"},{"id":"EPL-1.0","name":"Eclipse Public License 1.0","osi_approved":true,"fsf_free_software":true,"category":"Weakly Copyleft"},{"id":"EPL-2.0","name":"Eclipse Public License 2.0","osi_approved":true,"fsf_free_software":true,"category":"Weakly Copyleft"},{"id":"EUPL-1.1","name":"European Union Public License 1.1","osi_approved":true,"fsf_free_software":false,"category":"Copyleft"},{"id":"EUPL-1.2","name":"European Union Public License 1.2","osi_approved":true,"fsf_free_software":false,"category":"Copyleft"},{"id":"IPA","name":"IPA Font License","osi_approved":true,"fsf_free_software":false,"category":"Copyleft"},{"id":"LATEX2e","name":"LaTeX Project Public License v1.3c","osi_approved":true,"fsf_free_software":false,"category":"Copyleft"},{"id":"LiliQ-R-1.1","name":"LiliQ-R License v1.1","osi_approved":true,"fsf_free_software":false,"category":"Weakly Copyleft"},{"id":"LiliQ-Rplus-1.1","name":"LiliQ-R+ License v1.1","osi_approved":true,"fsf_free_software":false,"category":"Weakly Copyleft"},{"id":"LiliQ-R-Spec-1.1","name":"LiliQ-R Software Licence Agreement v1.1","osi_approved":true,"fsf_free_software":false,"category":"Weakly Copyleft"},{"id":"LiliQ-Rplus-Spec-1.1","name":"LiliQ-R+ Software Licence Agreement v1.1","osi_approved":true,"fsf_free_software":false,"category":"Weakly Copyleft"},{"id":"MS-PL","name":"Microsoft Public License","osi_approved":true,"fsf_free_software":false,"category":"Permissive"},{"id":"MS-RL","name":"Microsoft Reciprocal License","osi_approved":true,"fsf_free_software":false,"category":"Weakly Copyleft"},{"id":"NCSA","name":"University of Illinois/NCSA Open Source License","osi_approved":true,"fsf_free_software":true,"category":"Permissive"},{"id":"OFL-1.1","name":"SIL Open Font License 1.1","osi_approved":true,"fsf_free_software":true,"category":"Permissive"},{"id":"OSL-3.0","name":"Open Software License 3.0","osi_approved":true,"fsf_free_software":true,"category":"Copyleft"},{"id":"PostgreSQL","name":"PostgreSQL License","osi_approved":true,"fsf_free_software":true,"category":"Permissive"},{"id":"Python-2.0","name":"Python Software License 2.0","osi_approved":true,"fsf_free_software":true,"category":"Permissive"},{"id":"QPL-1.0","name":"Qt Public License v1.0","osi_approved":true,"fsf_free_software":false,"category":"Weakly Copyleft"},{"id":"Ruby","name":"Ruby License","osi_approved":false,"fsf_free_software":true,"category":"Permissive"},{"id":"SGI-B-1.0","name":"SGI Free Software License B v1.0","osi_approved":false,"fsf_free_software":true,"category":"Permissive"},{"id":"SSH-OpenSSH","name":"SSH OpenSSH license","osi_approved":false,"fsf_free_software":true,"category":"Permissive"},{"id":"Unicode-DFS-2016","name":"Unicode License Agreement - DFS-2016","osi_approved":true,"fsf_free_software":true,"category":"Permissive"},{"id":"UPL-1.0","name":"Universal Permissive License v1.0","osi_approved":true,"fsf_free_software":true,"category":"Permissive"},{"id":"VCL-1.0","name":"VistaCE License","osi_approved":false,"fsf_free_software":false,"category":"Proprietary"},{"id":"W3C","name":"W3C Software License","osi_approved":true,"fsf_free_software":true,"category":"Permissive"},{"id":"WTFPL","name":"Do What The F*ck You Want To Public License","osi_approved":false,"fsf_free_software":true,"category":"Public Domain"},{"id":"X11","name":"X11 License","osi_approved":false,"fsf_free_software":true,"category":"Permissive"},{"id":"Xnet","name":"X.Net License","osi_approved":true,"fsf_free_software":true,"category":"Permissive"},{"id":"ZPL-2.1","name":"Zope Public License 2.1","osi_approved":false,"fsf_free_software":true,"category":"Permissive"},{"id":"CC-PDDC","name":"Creative Commons Public Domain Dedication and Certification","osi_approved":false,"fsf_free_software":true,"category":"Public Domain"},{"id":"CC-BY-1.0","name":"Creative Commons Attribution 1.0 Generic","osi_approved":false,"fsf_free_software":true,"category":"Permissive"},{"id":"CC-BY-2.0","name":"Creative Commons Attribution 2.0 Generic","osi_approved":false,"fsf_free_software":true,"category":"Permissive"},{"id":"CC-BY-2.5","name":"Creative Commons Attribution 2.5 Generic","osi_approved":false,"fsf_free_software":true,"category":"Permissive"},{"id":"CC-BY-3.0","name":"Creative Commons Attribution 3.0 Unported","osi_approved":false,"fsf_free_software":true,"category":"Permissive"},{"id":"CC-BY-SA-1.0","name":"Creative Commons Attribution-ShareAlike 1.0 Generic","osi_approved":false,"fsf_free_software":true,"category":"Copyleft"},{"id":"CC-BY-SA-2.0","name":"Creative Commons Attribution-ShareAlike 2.0 Generic","osi_approved":false,"fsf_free_software":true,"category":"Copyleft"},{"id":"CC-BY-SA-2.5","name":"Creative Commons Attribution-ShareAlike 2.5 Generic","osi_approved":false,"fsf_free_software":true,"category":"Copyleft"},{"id":"CC-BY-SA-3.0","name":"Creative Commons Attribution-ShareAlike 3.0 Unported","osi_approved":false,"fsf_free_software":true,"category":"Copyleft"},{"id":"CC-BY-NC-1.0","name":"Creative Commons Attribution Non Commercial 1.0 Generic","osi_approved":false,"fsf_free_software":false,"category":"Non Commercial"},{"id":"CC-BY-NC-2.0","name":"Creative Commons Attribution Non Commercial 2.0 Generic","osi_approved":false,"fsf_free_software":false,"category":"Non Commercial"},{"id":"CC-BY-NC-2.5","name":"Creative Commons Attribution Non Commercial 2.5 Generic","osi_approved":false,"fsf_free_software":false,"category":"Non Commercial"},{"id":"CC-BY-NC-3.0","name":"Creative Commons Attribution Non Commercial 3.0 Unported","osi_approved":false,"fsf_free_software":false,"category":"Non Commercial"},{"id":"CC-BY-NC-4.0","name":"Creative Commons Attribution Non Commercial 4.0 International","osi_approved":false,"fsf_free_software":false,"category":"Non Commercial"},{"id":"CC-BY-NC-SA-1.0","name":"Creative Commons Attribution Non Commercial Share Alike 1.0 Generic","osi_approved":false,"fsf_free_software":false,"category":"Non Commercial"},{"id":"CC-BY-NC-SA-2.0","name":"Creative Commons Attribution Non Commercial Share Alike 2.0 Generic","osi_approved":false,"fsf_free_software":false,"category":"Non Commercial"},{"id":"CC-BY-NC-SA-2.5","name":"Creative Commons Attribution Non Commercial Share Alike 2.5 Generic","osi_approved":false,"fsf_free_software":false,"category":"Non Commercial"},{"id":"CC-BY-NC-SA-3.0","name":"Creative Commons Attribution Non Commercial Share Alike 3.0 Unported","osi_approved":false,"fsf_free_software":false,"category":"Non Commercial"},{"id":"CC-BY-NC-SA-4.0","name":"Creative Commons Attribution Non Commercial Share Alike 4.0 International","osi_approved":false,"fsf_free_software":false,"category":"Non Commercial"},{"id":"CC-BY-ND-1.0","name":"Creative Commons Attribution No Derivatives 1.0 Generic","osi_approved":false,"fsf_free_software":false,"category":"Non Commercial"},{"id":"CC-BY-ND-2.0","name":"Creative Commons Attribution No Derivatives 2.0 Generic","osi_approved":false,"fsf_free_software":false,"category":"Non Commercial"},{"id":"CC-BY-ND-2.5","name":"Creative Commons Attribution No Derivatives 2.5 Generic","osi_approved":false,"fsf_free_software":false,"category":"Non Commercial"},{"id":"CC-BY-ND-3.0","name":"Creative Commons Attribution No Derivatives 3.0 Unported","osi_approved":false,"fsf_free_software":false,"category":"Non Commercial"},{"id":"CC-BY-ND-4.0","name":"Creative Commons Attribution No Derivatives 4.0 International","osi_approved":false,"fsf_free_software":false,"category":"Non Commercial"},{"id":"OLDAP-2.7","name":"Open LDAP Public License v2.7","osi_approved":true,"fsf_free_software":true,"category":"Weakly Copyleft"},{"id":"OLDAP-2.8","name":"Open LDAP Public License v2.8","osi_approved":true,"fsf_free_software":true,"category":"Weakly Copyleft"},{"id":"PHP-3.0","name":"PHP License v3.0","osi_approved":true,"fsf_free_software":false,"category":"Permissive"},{"id":"OFL-1.1-no-rfn","name":"SIL Open Font License 1.1 with no RFN restriction","osi_approved":true,"fsf_free_software":true,"category":"Permissive"},{"id":"OFL-1.1-rfn","name":"SIL Open Font License 1.1 with RFN","osi_approved":true,"fsf_free_software":true,"category":"Permissive"},{"id":"CDDL-1.0","name":"Common Development and Distribution License 1.0","osi_approved":true,"fsf_free_software":false,"category":"Weakly Copyleft"},{"id":"CDDL-1.1","name":"Common Development and Distribution License 1.1","osi_approved":true,"fsf_free_software":false,"category":"Weakly Copyleft"},{"id":"CPL-1.0","name":"Common Public License 1.0","osi_approved":true,"fsf_free_software":true,"category":"Weakly Copyleft"}],"compatibility":{"matrix":{"MIT":{"MIT":true,"BSD-2-Clause":true,"ISC":true,"Apache-2.0":true,"0BSD":true,"Unlicense":true,"CC0-1.0":true,"LGPL-2.0-only":true,"LGPL-2.1-only":true,"LGPL-3.0-only":true,"MPL-2.0":true,"GPL-2.0-only":true,"GPL-2.0-or-later":true,"GPL-3.0-only":true,"GPL-3.0-or-later":true,"AGPL-3.0-only":true,"AGPL-3.0-or-later":true,"EPL-1.0":false,"EPL-2.0":true,"EUPL-1.1":false,"EUPL-1.2":true},"BSD-2-Clause":{"MIT":true,"BSD-2-Clause":true,"ISC":true,"Apache-2.0":true,"0BSD":true,"Unlicense":true,"CC0-1.0":true,"LGPL-2.0-only":true,"LGPL-2.1-only":true,"LGPL-3.0-only":true,"MPL-2.0":true,"GPL-2.0-only":true,"GPL-2.0-or-later":true,"GPL-3.0-only":true,"GPL-3.0-or-later":true,"AGPL-3.0-only":true,"AGPL-3.0-or-later":true,"EPL-1.0":false,"EPL-2.0":true,"EUPL-1.1":false,"EUPL-1.2":true},"ISC":{"MIT":true,"BSD-2-Clause":true,"ISC":true,"Apache-2.0":true,"0BSD":true,"Unlicense":true,"CC0-1.0":true,"LGPL-2.0-only":true,"LGPL-2.1-only":true,"LGPL-3.0-only":true,"MPL-2.0":true,"GPL-2.0-only":true,"GPL-2.0-or-later":true,"GPL-3.0-only":true,"GPL-3.0-or-later":true,"AGPL-3.0-only":true,"AGPL-3.0-or-later":true,"EPL-1.0":false,"EPL-2.0":true,"EUPL-1.1":false,"EUPL-1.2":true},"Apache-2.0":{"MIT":true,"BSD-2-Clause":true,"ISC":true,"Apache-2.0":true,"0BSD":true,"Unlicense":true,"CC0-1.0":true,"LGPL-2.0-only":false,"LGPL-2.1-only":false,"LGPL-3.0-only":true,"MPL-2.0":true,"GPL-2.0-only":false,"GPL-2.0-or-later":false,"GPL-3.0-only":true,"GPL-3.0-or-later":true,"AGPL-3.0-only":true,"AGPL-3.0-or-later":true,"EPL-1.0":false,"EPL-2.0":true,"EUPL-1.1":false,"EUPL-1.2":true},"0BSD":{"MIT":true,"BSD-2-Clause":true,"ISC":true,"Apache-2.0":true,"0BSD":true,"Unlicense":true,"CC0-1.0":true,"LGPL-2.0-only":true,"LGPL-2.1-only":true,"LGPL-3.0-only":true,"MPL-2.0":true,"GPL-2.0-only":true,"GPL-2.0-or-later":true,"GPL-3.0-only":true,"GPL-3.0-or-later":true,"AGPL-3.0-only":true,"AGPL-3.0-or-later":true,"EPL-1.0":true,"EPL-2.0":true,"EUPL-1.1":true,"EUPL-1.2":true},"Unlicense":{"MIT":true,"BSD-2-Clause":true,"ISC":true,"Apache-2.0":true,"0BSD":true,"Unlicense":true,"CC0-1.0":true,"LGPL-2.0-only":true,"LGPL-2.1-only":true,"LGPL-3.0-only":true,"MPL-2.0":true,"GPL-2.0-only":true,"GPL-2.0-or-later":true,"GPL-3.0-only":true,"GPL-3.0-or-later":true,"AGPL-3.0-only":true,"AGPL-3.0-or-later":true,"EPL-1.0":true,"EPL-2.0":true,"EUPL-1.1":true,"EUPL-1.2":true},"CC0-1.0":{"MIT":true,"BSD-2-Clause":true,"ISC":true,"Apache-2.0":true,"0BSD":true,"Unlicense":true,"CC0-1.0":true,"LGPL-2.0-only":true,"LGPL-2.1-only":true,"LGPL-3.0-only":true,"MPL-2.0":true,"GPL-2.0-only":true,"GPL-2.0-or-later":true,"GPL-3.0-only":true,"GPL-3.0-or-later":true,"AGPL-3.0-only":true,"AGPL-3.0-or-later":true,"EPL-1.0":true,"EPL-2.0":true,"EUPL-1.1":true,"EUPL-1.2":true},"LGPL-2.0-only":{"MIT":true,"BSD-2-Clause":true,"ISC":true,"Apache-2.0":false,"0BSD":true,"Unlicense":true,"CC0-1.0":true,"LGPL-2.0-only":true,"LGPL-2.1-only":true,"LGPL-3.0-only":true,"MPL-2.0":false,"GPL-2.0-only":true,"GPL-2.0-or-later":true,"GPL-3.0-only":true,"GPL-3.0-or-later":true,"AGPL-3.0-only":true,"AGPL-3.0-or-later":true,"EPL-1.0":false,"EPL-2.0":false,"EUPL-1.1":false,"EUPL-1.2":false},"LGPL-2.1-only":{"MIT":true,"BSD-2-Clause":true,"ISC":true,"Apache-2.0":false,"0BSD":true,"Unlicense":true,"CC0-1.0":true,"LGPL-2.0-only":false,"LGPL-2.1-only":true,"LGPL-3.0-only":true,"MPL-2.0":false,"GPL-2.0-only":true,"GPL-2.0-or-later":true,"GPL-3.0-only":true,"GPL-3.0-or-later":true,"AGPL-3.0-only":true,"AGPL-3.0-or-later":true,"EPL-1.0":false,"EPL-2.0":false,"EUPL-1.1":false,"EUPL-1.2":false},"LGPL-3.0-only":{"MIT":true,"BSD-2-Clause":true,"ISC":true,"Apache-2.0":true,"0BSD":true,"Unlicense":true,"CC0-1.0":true,"LGPL-2.0-only":false,"LGPL-2.1-only":false,"LGPL-3.0-only":true,"MPL-2.0":false,"GPL-2.0-only":false,"GPL-2.0-or-later":true,"GPL-3.0-only":true,"GPL-3.0-or-later":true,"AGPL-3.0-only":true,"AGPL-3.0-or-later":true,"EPL-1.0":false,"EPL-2.0":false,"EUPL-1.1":false,"EUPL-1.2":false},"MPL-2.0":{"MIT":true,"BSD-2-Clause":true,"ISC":true,"Apache-2.0":true,"0BSD":true,"Unlicense":true,"CC0-1.0":true,"LGPL-2.0-only":false,"LGPL-2.1-only":false,"LGPL-3.0-only":false,"MPL-2.0":true,"GPL-2.0-only":true,"GPL-2.0-or-later":true,"GPL-3.0-only":true,"GPL-3.0-or-later":true,"AGPL-3.0-only":true,"AGPL-3.0-or-later":true,"EPL-1.0":false,"EPL-2.0":true,"EUPL-1.1":false,"EUPL-1.2":true},"GPL-2.0-only":{"MIT":true,"BSD-2-Clause":true,"ISC":true,"Apache-2.0":false,"0BSD":true,"Unlicense":true,"CC0-1.0":true,"LGPL-2.0-only":false,"LGPL-2.1-only":false,"LGPL-3.0-only":false,"MPL-2.0":true,"GPL-2.0-only":true,"GPL-2.0-or-later":true,"GPL-3.0-only":false,"GPL-3.0-or-later":true,"AGPL-3.0-only":true,"AGPL-3.0-or-later":true,"EPL-1.0":false,"EPL-2.0":false,"EUPL-1.1":false,"EUPL-1.2":false},"GPL-2.0-or-later":{"MIT":true,"BSD-2-Clause":true,"ISC":true,"Apache-2.0":false,"0BSD":true,"Unlicense":true,"CC0-1.0":true,"LGPL-2.0-only":false,"LGPL-2.1-only":false,"LGPL-3.0-only":false,"MPL-2.0":true,"GPL-2.0-only":false,"GPL-2.0-or-later":true,"GPL-3.0-only":true,"GPL-3.0-or-later":true,"AGPL-3.0-only":true,"AGPL-3.0-or-later":true,"EPL-1.0":false,"EPL-2.0":false,"EUPL-1.1":false,"EUPL-1.2":false},"GPL-3.0-only":{"MIT":true,"BSD-2-Clause":true,"ISC":true,"Apache-2.0":true,"0BSD":true,"Unlicense":true,"CC0-1.0":true,"LGPL-2.0-only":false,"LGPL-2.1-only":false,"LGPL-3.0-only":false,"MPL-2.0":true,"GPL-2.0-only":false,"GPL-2.0-or-later":false,"GPL-3.0-only":true,"GPL-3.0-or-later":true,"AGPL-3.0-only":true,"AGPL-3.0-or-later":true,"EPL-1.0":false,"EPL-2.0":false,"EUPL-1.1":false,"EUPL-1.2":false},"GPL-3.0-or-later":{"MIT":true,"BSD-2-Clause":true,"ISC":true,"Apache-2.0":true,"0BSD":true,"Unlicense":true,"CC0-1.0":true,"LGPL-2.0-only":false,"LGPL-2.1-only":false,"LGPL-3.0-only":false,"MPL-2.0":true,"GPL-2.0-only":false,"GPL-2.0-or-later":false,"GPL-3.0-only":false,"GPL-3.0-or-later":true,"AGPL-3.0-only":true,"AGPL-3.0-or-later":true,"EPL-1.0":false,"EPL-2.0":false,"EUPL-1.1":false,"EUPL-1.2":false},"AGPL-3.0-only":{"MIT":true,"BSD-2-Clause":true,"ISC":true,"Apache-2.0":true,"0BSD":true,"Unlicense":true,"CC0-1.0":true,"LGPL-2.0-only":false,"LGPL-2.1-only":false,"LGPL-3.0-only":false,"MPL-2.0":false,"GPL-2.0-only":false,"GPL-2.0-or-later":false,"GPL-3.0-only":false,"GPL-3.0-or-later":false,"AGPL-3.0-only":true,"AGPL-3.0-or-later":true,"EPL-1.0":false,"EPL-2.0":false,"EUPL-1.1":false,"EUPL-1.2":false},"AGPL-3.0-or-later":{"MIT":true,"BSD-2-Clause":true,"ISC":true,"Apache-2.0":true,"0BSD":true,"Unlicense":true,"CC0-1.0":true,"LGPL-2.0-only":false,"LGPL-2.1-only":false,"LGPL-3.0-only":false,"MPL-2.0":false,"GPL-2.0-only":false,"GPL-2.0-or-later":false,"GPL-3.0-only":false,"GPL-3.0-or-later":false,"AGPL-3.0-only":false,"AGPL-3.0-or-later":true,"EPL-1.0":false,"EPL-2.0":false,"EUPL-1.1":false,"EUPL-1.2":false},"EPL-1.0":{"MIT":false,"BSD-2-Clause":false,"ISC":false,"Apache-2.0":false,"0BSD":true,"Unlicense":true,"CC0-1.0":true,"LGPL-2.0-only":false,"LGPL-2.1-only":false,"LGPL-3.0-only":false,"MPL-2.0":false,"GPL-2.0-only":false,"GPL-2.0-or-later":false,"GPL-3.0-only":false,"GPL-3.0-or-later":false,"AGPL-3.0-only":false,"AGPL-3.0-or-later":false,"EPL-1.0":true,"EPL-2.0":false,"EUPL-1.1":false,"EUPL-1.2":false},"EPL-2.0":{"MIT":true,"BSD-2-Clause":true,"ISC":true,"Apache-2.0":true,"0BSD":true,"Unlicense":true,"CC0-1.0":true,"LGPL-2.0-only":false,"LGPL-2.1-only":false,"LGPL-3.0-only":false,"MPL-2.0":true,"GPL-2.0-only":false,"GPL-2.0-or-later":false,"GPL-3.0-only":false,"GPL-3.0-or-later":false,"AGPL-3.0-only":false,"AGPL-3.0-or-later":false,"EPL-1.0":false,"EPL-2.0":true,"EUPL-1.1":false,"EUPL-1.2":false},"EUPL-1.1":{"MIT":false,"BSD-2-Clause":false,"ISC":false,"Apache-2.0":false,"0BSD":true,"Unlicense":true,"CC0-1.0":true,"LGPL-2.0-only":false,"LGPL-2.1-only":false,"LGPL-3.0-only":false,"MPL-2.0":false,"GPL-2.0-only":false,"GPL-2.0-or-later":false,"GPL-3.0-only":false,"GPL-3.0-or-later":false,"AGPL-3.0-only":false,"AGPL-3.0-or-later":false,"EPL-1.0":false,"EPL-2.0":false,"EUPL-1.1":true,"EUPL-1.2":true},"EUPL-1.2":{"MIT":true,"BSD-2-Clause":true,"ISC":true,"Apache-2.0":true,"0BSD":true,"Unlicense":true,"CC0-1.0":true,"LGPL-2.0-only":false,"LGPL-2.1-only":false,"LGPL-3.0-only":false,"MPL-2.0":true,"GPL-2.0-only":false,"GPL-2.0-or-later":false,"GPL-3.0-only":false,"GPL-3.0-or-later":false,"AGPL-3.0-only":false,"AGPL-3.0-or-later":false,"EPL-1.0":false,"EPL-2.0":false,"EUPL-1.1":true,"EUPL-1.2":true}},"upgrade_paths":{"GPL-2.0-only":["GPL-2.0-or-later","GPL-3.0-or-later"],"GPL-2.0-or-later":["GPL-3.0-or-later"],"LGPL-2.0-only":["LGPL-2.1-only","LGPL-3.0-only"],"LGPL-2.1-only":["LGPL-3.0-only"],"AGPL-3.0-only":["AGPL-3.0-or-later"]}}};

// ---- engine-hash.js ----
(function () {
  if (typeof window !== 'undefined') window.GLGEngine = window.GLGEngine || {};
  var ROOT = (typeof window !== 'undefined') ? window : (typeof self !== 'undefined' ? self : globalThis);
  ROOT.GLGEngine = ROOT.GLGEngine || {};
  var NS = ROOT.GLGEngine;

  // Ported from src/license.rs + src/crypto.rs (GLG Rust -> JS)

  function utf8Encode(str) {
    var out = [];
    var i = 0;
    var n = str.length;
    while (i < n) {
      var c = str.charCodeAt(i);
      if (c < 0x80) {
        out.push(c); i++;
      } else if (c < 0x800) {
        out.push(0xC0 | (c >> 6), 0x80 | (c & 0x3F)); i++;
      } else if (c >= 0xD800 && c <= 0xDBFF && i + 1 < n) {
        var c2 = str.charCodeAt(i + 1);
        if (c2 >= 0xDC00 && c2 <= 0xDFFF) {
          var cp = 0x10000 + ((c - 0xD800) << 10) + (c2 - 0xDC00);
          out.push(0xF0 | (cp >> 18), 0x80 | ((cp >> 12) & 0x3F), 0x80 | ((cp >> 6) & 0x3F), 0x80 | (cp & 0x3F));
          i += 2; continue;
        }
        out.push(0xEF, 0xBF, 0xBD); i++;
      } else if (c >= 0xDC00 && c <= 0xDFFF) {
        out.push(0xEF, 0xBF, 0xBD); i++;
      } else {
        out.push(0xE0 | (c >> 12), 0x80 | ((c >> 6) & 0x3F), 0x80 | (c & 0x3F)); i++;
      }
    }
    var bytes = new Uint8Array(out.length);
    for (var j = 0; j < out.length; j++) bytes[j] = out[j];
    return bytes;
  }

  // ── SHA-256 ────────────────────────────────────────────────────────────────
  var SHA256_K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];
  function sha256Hex(str) {
    var data = utf8Encode(str);
    var h0 = 0x6a09e667, h1 = 0xbb67ae85, h2 = 0x3c6ef372, h3 = 0xa54ff53a,
        h4 = 0x510e527f, h5 = 0x9b05688c, h6 = 0x1f83d9ab, h7 = 0x5be0cd19;
    var bitLenHi = 0, bitLenLo = 0;
    var n = data.length;
    var paddedLen = (((n + 8) >> 6) + 1) << 6;
    var buf = new Uint8Array(paddedLen);
    buf.set(data);
    buf[n] = 0x80;
    bitLenLo = (n << 3) >>> 0;
    bitLenHi = Math.floor(n / 536870912) >>> 0;
    var view = new DataView(buf.buffer);
    view.setUint32(paddedLen - 8, bitLenHi);
    view.setUint32(paddedLen - 4, bitLenLo);
    var w = new Uint32Array(64);
    for (var off = 0; off < paddedLen; off += 64) {
      for (var t = 0; t < 16; t++) w[t] = view.getUint32(off + t * 4);
      for (t = 16; t < 64; t++) {
        var s0 = ((w[t - 15] >>> 7) | (w[t - 15] << 25)) ^ ((w[t - 15] >>> 18) | (w[t - 15] << 14)) ^ (w[t - 15] >>> 3);
        var s1 = ((w[t - 2] >>> 17) | (w[t - 2] << 15)) ^ ((w[t - 2] >>> 19) | (w[t - 2] << 13)) ^ (w[t - 2] >>> 10);
        w[t] = (w[t - 16] + s0 + w[t - 7] + s1) >>> 0;
      }
      var a = h0, b = h1, c = h2, d = h3, e = h4, f = h5, g = h6, h = h7;
      for (t = 0; t < 64; t++) {
        var S1 = ((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7));
        var ch = (e & f) ^ (~e & g);
        var temp1 = (h + S1 + ch + SHA256_K[t] + w[t]) >>> 0;
        var S0 = ((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10));
        var maj = (a & b) ^ (a & c) ^ (b & c);
        var temp2 = (S0 + maj) >>> 0;
        h = g; g = f; f = e; e = (d + temp1) >>> 0; d = c; c = b; b = a; a = (temp1 + temp2) >>> 0;
      }
      h0 = (h0 + a) >>> 0; h1 = (h1 + b) >>> 0; h2 = (h2 + c) >>> 0; h3 = (h3 + d) >>> 0;
      h4 = (h4 + e) >>> 0; h5 = (h5 + f) >>> 0; h6 = (h6 + g) >>> 0; h7 = (h7 + h) >>> 0;
    }
    return hex8(h0) + hex8(h1) + hex8(h2) + hex8(h3) + hex8(h4) + hex8(h5) + hex8(h6) + hex8(h7);
  }

  // ── SHA3-256 (FIPS 202, Keccak-f[1600]) ───────────────────────────────────
  var RC_CONST = [
    0x0000000000000001n, 0x0000000000008082n, 0x800000000000808an, 0x8000000080008000n,
    0x000000000000808bn, 0x0000000080000001n, 0x8000000080008081n, 0x8000000000008009n,
    0x000000000000008an, 0x0000000000000088n, 0x0000000080008009n, 0x000000008000000an,
    0x000000008000808bn, 0x800000000000008bn, 0x8000000000008089n, 0x8000000000008003n,
    0x8000000000008002n, 0x8000000000000080n, 0x000000000000800an, 0x800000008000000an,
    0x8000000080008081n, 0x8000000000008080n, 0x0000000080000001n, 0x8000000080008008n
  ];
  var ROT_OFFSETS = [
    [0, 36, 3, 41, 18], [1, 44, 10, 45, 2], [62, 6, 43, 15, 61],
    [28, 55, 25, 21, 56], [27, 20, 39, 8, 14]
  ];
  var MASK64 = 0xFFFFFFFFFFFFFFFFn;
  function rol64(x, n) { return ((x << BigInt(n)) | (x >> BigInt(64 - n))) & MASK64; }
  function keccakF(state) {
    for (var round = 0; round < 24; round++) {
      var c = [0n, 0n, 0n, 0n, 0n];
      var i, x, y;
      for (i = 0; i < 5; i++) {
        c[i] = state[i] ^ state[i + 5] ^ state[i + 10] ^ state[i + 15] ^ state[i + 20];
      }
      var d = [0n, 0n, 0n, 0n, 0n];
      for (i = 0; i < 5; i++) {
        d[i] = c[(i + 4) % 5] ^ rol64(c[(i + 1) % 5], 1);
      }
      for (i = 0; i < 25; i++) state[i] = state[i] ^ d[i % 5];
      var B = new Array(25);
      for (x = 0; x < 5; x++) {
        for (y = 0; y < 5; y++) {
          // pi step: dest(y, 2*(x-y)%5) = rot(src(x,y))
          var dx = y;
          var dy = ((2 * (x - y)) % 5 + 5) % 5;
          B[dx + 5 * dy] = rol64(state[x + 5 * y], ROT_OFFSETS[x][y]);
        }
      }
      for (x = 0; x < 5; x++) {
        for (y = 0; y < 5; y++) {
          var idx = x + 5 * y;
          state[idx] = B[idx] ^ ((~B[(x + 1) % 5 + 5 * y]) & B[(x + 2) % 5 + 5 * y]);
        }
      }
      state[0] = state[0] ^ RC_CONST[round];
    }
  }
  function sha3_256Hex(str) {
    var data = utf8Encode(str);
    var rate = 136;
    var state = new Array(25).fill(0n);
    var block = new Uint8Array(rate);
    var n = data.length;
    var off = 0;
    while (off + rate <= n) {
      for (var i = 0; i < rate; i++) block[i] = data[off + i];
      absorbBytes(state, block);
      keccakF(state);
      off += rate;
    }
    block.fill(0);
    var rem = n - off;
    for (i = 0; i < rem; i++) block[i] = data[off + i];
    block[rem] = 0x06;
    block[rate - 1] |= 0x80;
    absorbBytes(state, block);
    keccakF(state);
    var out = '';
    for (i = 0; i < 4; i++) {
      var word = state[i];
      for (var b = 0; b < 8; b++) {
        var byte = Number((word >> BigInt(8 * b)) & 0xFFn);
        out += ('0' + byte.toString(16)).slice(-2);
      }
    }
    return out;
  }
  function absorbBytes(state, block) {
    for (var i = 0; i < 17; i++) {
      var lane = 0n;
      var base = i * 8;
      for (var b = 0; b < 8; b++) {
        lane |= BigInt(block[base + b]) << BigInt(8 * b);
      }
      state[i] = state[i] ^ lane;
    }
  }

  // ── BLAKE3 (hash mode, reference tree) ─────────────────────────────────────
  var B3_BLOCK_LEN = 64;
  var B3_CHUNK_LEN = 1024;
  var B3_CHUNK_START = 1, B3_CHUNK_END = 2, B3_PARENT = 4, B3_ROOT = 8;
  var B3_IV = [0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19];
  var B3_PERM = [2, 6, 3, 10, 7, 0, 4, 13, 1, 11, 12, 5, 9, 14, 15, 8];
  function b3_rotr(x, n) { return ((x >>> n) | (x << (32 - n))) >>> 0; }
  function b3_g(s, a, b, c, d, mx, my) {
    s[a] = (s[a] + s[b] + mx) >>> 0;
    s[d] = b3_rotr(s[d] ^ s[a], 16);
    s[c] = (s[c] + s[d]) >>> 0;
    s[b] = b3_rotr(s[b] ^ s[c], 12);
    s[a] = (s[a] + s[b] + my) >>> 0;
    s[d] = b3_rotr(s[d] ^ s[a], 8);
    s[c] = (s[c] + s[d]) >>> 0;
    s[b] = b3_rotr(s[b] ^ s[c], 7);
  }
  function b3_round(s, m) {
    b3_g(s, 0, 4, 8, 12, m[0], m[1]);
    b3_g(s, 1, 5, 9, 13, m[2], m[3]);
    b3_g(s, 2, 6, 10, 14, m[4], m[5]);
    b3_g(s, 3, 7, 11, 15, m[6], m[7]);
    b3_g(s, 0, 5, 10, 15, m[8], m[9]);
    b3_g(s, 1, 6, 11, 12, m[10], m[11]);
    b3_g(s, 2, 7, 8, 13, m[12], m[13]);
    b3_g(s, 3, 4, 9, 14, m[14], m[15]);
  }
  function b3_permute(m) {
    var nm = new Array(16);
    for (var i = 0; i < 16; i++) nm[i] = m[B3_PERM[i]];
    return nm;
  }
  function b3_compress(cv, blockWords, counter, blockLen, flags) {
    var s = new Array(16);
    for (var i = 0; i < 8; i++) s[i] = cv[i];
    for (i = 8; i < 16; i++) s[i] = B3_IV[i - 8];
    s[12] = (counter & 0xFFFFFFFF) >>> 0;
    s[13] = Math.floor(counter / 0x100000000) >>> 0;
    s[14] = blockLen >>> 0;
    s[15] = flags >>> 0;
    var m = blockWords.slice();
    var r;
    for (r = 0; r < 7; r++) {
      b3_round(s, m);
      m = b3_permute(m);
    }
    for (i = 0; i < 8; i++) {
      s[i] = (s[i] ^ s[i + 8]) >>> 0;
      s[i + 8] = (s[i + 8] ^ cv[i]) >>> 0;
    }
    return s;
  }
  function b3_blockWords(block, len) {
    var w = new Array(16).fill(0);
    var i;
    for (i = 0; i < 16; i++) {
      var v = 0;
      for (var b = 0; b < 4; b++) {
        var idx = i * 4 + b;
        v |= (idx < len ? block[idx] : 0) << (8 * b);
      }
      w[i] = v >>> 0;
    }
    return w;
  }
  function b3_largestPow2StrictLess(n) {
    var p = 1;
    while ((p << 1) < n) p <<= 1;
    return p;
  }
  function b3_hashImpl(data, key, flags, chunkCounter, isRoot) {
    var total = data.length;
    if (total <= B3_CHUNK_LEN) {
      var state = key.slice();
      var nblocks = Math.max(1, Math.ceil(total / B3_BLOCK_LEN));
      var bi, start, end, f;
      for (bi = 0; bi < nblocks; bi++) {
        start = bi * B3_BLOCK_LEN;
        end = Math.min(start + B3_BLOCK_LEN, total);
        f = flags;
        if (bi === 0) f |= B3_CHUNK_START;
        if (bi === nblocks - 1) {
          f |= B3_CHUNK_END;
          if (isRoot) f |= B3_ROOT;
        }
        var out = b3_compress(state, b3_blockWords(data.subarray(start, end), end - start), chunkCounter, end - start, f);
        state = out.slice(0, 8);
      }
      return state;
    } else {
      var numChunks = Math.ceil(total / B3_CHUNK_LEN);
      var leftChunks = b3_largestPow2StrictLess(numChunks);
      var leftBytes = leftChunks * B3_CHUNK_LEN;
      var left = data.subarray(0, leftBytes);
      var right = data.subarray(leftBytes);
      var leftCv = b3_hashImpl(left, key, flags, chunkCounter, false);
      var rightCv = b3_hashImpl(right, key, flags, chunkCounter + leftChunks, false);
      var block = leftCv.concat(rightCv);
      f = flags | B3_PARENT;
      if (isRoot) f |= B3_ROOT;
      var s = b3_compress(key, block, 0, B3_BLOCK_LEN, f);
      return s.slice(0, 8);
    }
  }
  function blake3Hex(str) {
    var data = utf8Encode(str);
    var cv = b3_hashImpl(data, B3_IV, 0, 0, true);
    var out = '';
    // reference: le_bytes_from_words_32 -> each u32 written little-endian
    function lb(w) {
      var s = '';
      for (var b = 0; b < 4; b++) s += hex8((w >>> (8 * b)) & 0xff).slice(6);
      return s;
    }
    for (var i = 0; i < 8; i++) {
      out += lb(cv[i]);
    }
    return out.slice(0, 64);
  }

  function hex8(x) {
    x >>>= 0;
    var s = x.toString(16);
    while (s.length < 8) s = '0' + s;
    return s;
  }

  NS.Hashing = {
    sha256: sha256Hex,
    sha3_256: sha3_256Hex,
    blake3: blake3Hex,
    compute: function (text) {
      return { blake3: blake3Hex(text), sha256: sha256Hex(text), sha3_256: sha3_256Hex(text) };
    }
  };
})();

// ---- engine-core.js ----
(function () {
  if (typeof window !== 'undefined') window.GLGEngine = window.GLGEngine || {};
  var ROOT = (typeof window !== 'undefined') ? window : (typeof self !== 'undefined' ? self : globalThis);
  ROOT.GLGEngine = ROOT.GLGEngine || {};
  var NS = ROOT.GLGEngine;

  // Ported from src/clauses.rs + src/compiler.rs (GLG Rust -> JS)

  function data() { return GLG_DATA; }

  // ── AnswerValue helpers (serde external-tag shape) ─────────────────────────
  function getAnswerBoolean(answers, id) {
    for (var i = 0; i < answers.length; i++) {
      var a = answers[i];
      if (a.question_id === id) {
        var v = a.value;
        if (v && v.Boolean !== undefined) return v.Boolean;
        if (v && v.Choice !== undefined) return v.Choice === 'true' || v.Choice === 'yes' || v.Choice === '1';
        return false;
      }
    }
    return false;
  }
  function getAnswerChoice(answers, id) {
    for (var i = 0; i < answers.length; i++) {
      var a = answers[i];
      if (a.question_id === id) {
        var v = a.value;
        if (v && v.Choice !== undefined) return v.Choice;
        if (v && v.Text !== undefined) return v.Text;
        return null;
      }
    }
    return null;
  }
  function getAnswerMultiChoice(answers, id) {
    for (var i = 0; i < answers.length; i++) {
      var a = answers[i];
      if (a.question_id === id) {
        var v = a.value;
        if (v && v.MultiChoice !== undefined) return v.MultiChoice.slice();
        if (v && v.Text !== undefined) return v.Text.split(',').map(function (s) { return s.trim(); });
        return [];
      }
    }
    return [];
  }
  function getAnswerText(answers, id) {
    for (var i = 0; i < answers.length; i++) {
      var a = answers[i];
      if (a.question_id === id) {
        var v = a.value;
        if (v && v.Text !== undefined) return v.Text;
        if (v && v.Choice !== undefined) return v.Choice;
        return null;
      }
    }
    return null;
  }
  function getAnswerNumber(answers, id) {
    for (var i = 0; i < answers.length; i++) {
      var a = answers[i];
      if (a.question_id === id) {
        var v = a.value;
        if (v && v.Number !== undefined) return v.Number;
        if (v && v.Text !== undefined) { var n = parseInt(v.Text, 10); return isNaN(n) ? null : n; }
        if (v && v.Choice !== undefined) { var n2 = parseInt(v.Choice, 10); return isNaN(n2) ? null : n2; }
        return null;
      }
    }
    return null;
  }
  function requestDualLicense(answers) {
    var a = getAnswerText(answers, 'dual_license_a');
    var b = getAnswerText(answers, 'dual_license_b');
    if (a == null || b == null) return null;
    if (a === '' || b === '') return null;
    return [a, b];
  }

  // ── ClauseDatabase ─────────────────────────────────────────────────────────
  function ClauseDatabase(clauses) {
    this.clauses = clauses || [];
  }
  ClauseDatabase.prototype.getByUuid = function (uuid) {
    for (var i = 0; i < this.clauses.length; i++) if (this.clauses[i].uuid === uuid) return this.clauses[i];
    return null;
  };
  ClauseDatabase.prototype.getByName = function (name) {
    for (var i = 0; i < this.clauses.length; i++) if (this.clauses[i].name === name) return this.clauses[i];
    return null;
  };
  ClauseDatabase.prototype.validateDependencies = function (names) {
    var resolved = [];
    for (var i = 0; i < names.length; i++) {
      var name = names[i];
      var clause = this.getByName(name);
      if (!clause) throw { name: 'ClauseError', kind: 'NotFound', clause: name };
      resolved.push(clause);
      for (var d = 0; d < clause.dependencies.length; d++) {
        var depName = clause.dependencies[d];
        if (names.indexOf(depName) === -1) {
          throw { name: 'ClauseError', kind: 'MissingDependency', clause: name, dependency: depName };
        }
        var has = false;
        for (var r = 0; r < resolved.length; r++) if (resolved[r].name === depName) { has = true; break; }
        if (!has) {
          var depClause = this.getByName(depName);
          if (!depClause) throw { name: 'ClauseError', kind: 'NotFound', clause: depName };
          resolved.push(depClause);
        }
      }
    }
    return resolved;
  };

  var PERMISSION = 'permission', CONDITION = 'condition', RESTRICTION = 'restriction',
      PATENT = 'patent', TRADEMARK = 'trademark', WARRANTY = 'warranty', LIABILITY = 'liability',
      TERMINATION = 'termination', PRIVACY = 'privacy', COMPLIANCE = 'compliance',
      COMMERCIAL = 'commercial', META = 'meta';

  // ── LicenseCompiler ────────────────────────────────────────────────────────
  function LicenseCompiler() {
    this.clauseDb = new ClauseDatabase(data().clauses);
  }

  LicenseCompiler.prototype.compile = function (request) {
    var self = this;
    // 1. validate
    this.validateRequest(request);

    // 2. select clauses
    var selectedNames = this.selectClauses(request.answers);

    // 3. variables
    var variables = this.buildVariables(request);

    // 4. compile each clause
    var compiledClauses = [];
    var warnings = [];
    var skipped = [];
    for (var i = 0; i < selectedNames.length; i++) {
      var name = selectedNames[i];
      var clause = this.clauseDb.getByName(name);
      if (clause) {
        try {
          var rendered = renderClause(clause, variables);
          compiledClauses.push({
            clause_uuid: clause.uuid,
            name: clause.name,
            content: rendered,
            category: clause.category,
            priority: clause.priority
          });
        } catch (e) {
          warnings.push({
            code: 'MissingRecommended',
            message: "Failed to render clause '" + name + "': " + (e.description || e.message || e),
            clause: name
          });
          skipped.push(name);
        }
      } else {
        warnings.push({
          code: 'CustomLicenseGenerated',
          message: "Clause '" + name + "' not found in database",
          clause: name
        });
        skipped.push(name);
      }
    }

    // 5. compatibility warnings
    warnings = warnings.concat(this.checkCompatibility(selectedNames));

    // 6. SPDX identifier
    var spdxId = this.determineSpdx(request.answers);
    var finalSpdx = request.spdx_override || spdxId;
    if (finalSpdx) {
      var ok = NS.Spdx && NS.Spdx.validateId ? NS.Spdx.validateId(finalSpdx) : true;
      if (!ok) {
        warnings.push({
          code: 'NonStandardSpdx',
          message: "SPDX identifier '" + finalSpdx + "' is not in the standard SPDX database",
          clause: null
        });
      }
    }

    // 7. category
    var category = this.determineLicenseType(request.answers);

    // 8. categorize
    compiledClauses.sort(function (a, b) { return a.priority - b.priority; });
    var conditions = [], permissions = [], restrictions = [];
    var patentGrant = null, warranty = '';
    for (i = 0; i < compiledClauses.length; i++) {
      var c = compiledClauses[i];
      switch (c.category) {
        case PERMISSION: permissions.push(c.content); break;
        case CONDITION: conditions.push(c.content); break;
        case RESTRICTION: restrictions.push(c.content); break;
        case PATENT:
          if (patentGrant) patentGrant = patentGrant + '\n\n' + c.content;
          else patentGrant = c.content;
          break;
        case WARRANTY:
          if (warranty) warranty += '\n\n';
          warranty += c.content;
          break;
        default: break;
      }
    }

    // 9. full text
    var header = this.buildHeader(request);
    var preamble = this.buildPreamble(request);
    var sections = compiledClauses.map(function (c) {
      return { title: c.name, content: c.content, category: c.category, clause_uuid: c.clause_uuid, priority: c.priority };
    });
    var footer = warranty;
    var fullText = this.renderFullText(header, preamble, sections, footer);

    // 10. hashes + metadata
    var hash = NS.Hashing.compute(fullText);
    var fingerprint = hash.blake3;
    var now = new Date().toISOString();
    var uuid = uuidV4();
    var metadata = {
      id: { uuid: uuid, fingerprint: fingerprint, spdx_identifier: finalSpdx || null },
      name: request.project_name,
      description: 'Granular license for ' + request.project_name,
      version: '1.0.0',
      created_at: now,
      modified_at: now,
      authors: request.copyright_holders,
      tags: [category],
      category: category,
      spdx_id: finalSpdx || null,
      custom_id: null
    };
    var license = {
      metadata: metadata,
      preamble: preamble,
      clauses: compiledClauses,
      conditions: conditions,
      permissions: permissions,
      restrictions: restrictions,
      patent_grant: patentGrant,
      warranty_disclaimer: warranty,
      full_text: fullText,
      hash: hash
    };

    // 11. suggestions
    var suggestions = this.generateSuggestions(request.answers);

    var applied = selectedNames.filter(function (n) { return skipped.indexOf(n) === -1; });

    return {
      license: license,
      warnings: warnings,
      suggestions: suggestions,
      applied_clauses: applied,
      skipped_clauses: skipped
    };
  };

  function renderClause(clause, variables) {
    var output = clause.template;
    for (var i = 0; i < clause.variables.length; i++) {
      var varName = clause.variables[i];
      if (variables[varName] !== undefined && variables[varName] !== null) {
        output = output.split('{' + varName + '}').join(variables[varName]);
      } else {
        var err = new Error("clause '" + clause.name + "' requires variable '" + varName + "' which was not provided");
        err.clause = clause.name;
        err.variable = varName;
        err.description = "variable '" + varName + "' is required but was not provided";
        throw err;
      }
    }
    return output;
  }

  LicenseCompiler.prototype.validateRequest = function (request) {
    function invalid(msg) { throw { name: 'CompilerError', kind: 'InvalidRequest', message: msg }; }
    if (!request.project_name || request.project_name.trim() === '') invalid('project_name must not be empty');
    if (request.year < 1970 || request.year > 2100) invalid('year ' + request.year + ' is out of reasonable range (1970-2100)');
    if (!request.copyright_holders || request.copyright_holders.length === 0) invalid('at least one copyright holder is required');
    for (var i = 0; i < request.copyright_holders.length; i++) {
      var author = request.copyright_holders[i];
      if ((author.name || '').trim() === '') invalid('copyright holder at index ' + i + ' has an empty name');
    }
    if (request.dual_license) {
      if (!request.dual_license[0].trim() || !request.dual_license[1].trim()) invalid('dual_license identifiers must not be empty');
    }
  };

  LicenseCompiler.prototype.selectClauses = function (answers) {
    var desired = [];
    var Self = LicenseCompiler;
    var db = this.clauseDb;

    var licenseType = Self.getAnswerChoice(answers, 'license_type') || 'permissive';

    switch (licenseType) {
      case 'permissive':
        desired.push('MIT-PERMISSION', 'MIT-CONDITION', 'MIT-WARRANTY');
        break;
      case 'copyleft':
        desired.push('GPL-COPYLEFT');
        break;
      case 'public_domain': {
        var variant = Self.getAnswerChoice(answers, 'public_domain_variant');
        if (variant === 'cc0') desired.push('CC0-PERMISSION');
        else desired.push('UNLICENSE');
        break;
      }
      case 'bsd': {
        var bsdVariant = Self.getAnswerChoice(answers, 'bsd_variant');
        if (bsdVariant === 'bsd-3') {
          desired.push('BSD-2-PERMISSION', 'BSD-2-DISCLAIMER', 'BSD-3-ADVERTISING');
        } else {
          desired.push('BSD-2-PERMISSION', 'BSD-2-DISCLAIMER');
        }
        break;
      }
      case 'apache':
        desired.push('APACHE-PERMISSION', 'APACHE-PATENT');
        break;
      case 'isc':
        desired.push('ISC-PERMISSION', 'ISC-DISCLAIMER');
        break;
      case 'mpl':
        desired.push('MPL-CONDITION');
        break;
      case 'lgpl':
        desired.push('LGPL-STATIC', 'GPL-COPYLEFT');
        break;
      case 'network_copyleft':
        desired.push('GPL-COPYLEFT', 'NETWORK-COPYLEFT');
        break;
      case 'proprietary':
        desired.push('COPYRIGHT-NOTICE');
        break;
      case 'commercial':
        desired.push('COPYRIGHT-NOTICE');
        break;
      default:
        throw { name: 'CompilerError', kind: 'ClauseSelectionError', message: "unknown license type '" + licenseType + "'" };
    }

    function pushBool(id, name) { if (Self.getAnswerBoolean(answers, id)) desired.push(name); }
    pushBool('require_attribution', 'ATTRIBUTION');
    pushBool('copyright_notice', 'COPYRIGHT-NOTICE');
    if (Self.getAnswerBoolean(answers, 'require_patent_grant') && desired.indexOf('APACHE-PATENT') === -1) {
      desired.push('PATENT-RETALIATION');
    }
    pushBool('include_termination', 'TERMINATION');
    pushBool('include_revision', 'REVISION');
    pushBool('include_liability_capped', 'LIABILITY-CAPPED');
    pushBool('allow_derivative_works', 'DERIVATIVE-WORKS-ALLOW');
    pushBool('require_source_disclosure', 'SOURCE-DISCLOSURE');
    pushBool('include_government_use', 'GOVERNMENT-USE');
    pushBool('include_education_exception', 'EDUCATION-EXCEPTION');
    pushBool('include_nonprofit_exception', 'NONPROFIT-EXCEPTION');
    pushBool('include_cloud_hosting', 'CLOUD-HOSTING');
    pushBool('include_container_rights', 'CONTAINER-RIGHTS');
    pushBool('ai_training_restricted', 'AI-TRAINING-RESTRICTION');
    pushBool('military_restricted', 'MILITARY-RESTRICTION');
    pushBool('nuclear_restricted', 'NUCLEAR-RESTRICTION');
    pushBool('healthcare_restricted', 'HEALTHCARE-RESTRICTION');
    pushBool('export_control', 'EXPORT-CONTROL');
    pushBool('no_commercial', 'NO-COMMERCIAL');
    pushBool('no_trademark', 'NO-TRADEmark');
    pushBool('network_copyleft_restriction', 'NETWORK-COPYLEFT');
    pushBool('no_derivatives', 'NO-DERIVATIVES');
    pushBool('drm_restriction', 'DRM-RESTRICTION');
    pushBool('privacy_no_telemetry', 'PRIVACY-NO-TELEMETRY');
    pushBool('telemetry_notice', 'TELEMETRY-NOTICE');
    pushBool('resale_restriction', 'RESALE-RESTRICTION');

    var commercialModel = Self.getAnswerChoice(answers, 'commercial_model');
    switch (commercialModel) {
      case 'subscription': desired.push('SUBSCRIPTION-LICENSE'); break;
      case 'evaluation': desired.push('EVALUATION-LICENSE'); break;
      case 'open_core': desired.push('OPEN-CORE'); break;
      case 'per_seat': desired.push('PER-SEAT-LICENSE'); break;
      case 'per_company': desired.push('PER-COMPANY-LICENSE'); break;
      case 'oem': desired.push('OEM-LICENSE'); break;
      default: break;
    }

    if (Self.getAnswerBoolean(answers, 'provide_warranty')) desired.push('WARRANTY-PROVIDED');

    var extra = Self.getAnswerMultiChoice(answers, 'additional_restrictions');
    var map = {
      'no_commercial': 'NO-COMMERCIAL',
      'no_derivatives': 'NO-DERIVATIVES',
      'ai_training': 'AI-TRAINING-RESTRICTION',
      'military': 'MILITARY-RESTRICTION',
      'network_copyleft': 'NETWORK-COPYLEFT'
    };
    for (var i = 0; i < extra.length; i++) {
      var clauseName = map[extra[i]];
      if (clauseName && desired.indexOf(clauseName) === -1) desired.push(clauseName);
    }

    if (requestDualLicense(answers)) desired.push('DUAL-LICENSE');

    // dedupe preserving order
    var seen = {};
    desired = desired.filter(function (name) {
      if (seen[name]) return false;
      seen[name] = true;
      return true;
    });

    // filter to existing clauses
    desired = desired.filter(function (name) { return db.getByName(name); });

    // resolve dependencies
    var resolved = this.resolveDependencies(desired);

    // validate all resolved exist + deps satisfied
    for (i = 0; i < resolved.length; i++) {
      if (!db.getByName(resolved[i])) {
        throw { name: 'CompilerError', kind: 'ClauseSelectionError', message: "resolved clause '" + resolved[i] + "' not found in database" };
      }
    }
    try {
      db.validateDependencies(resolved);
    } catch (e) {
      throw { name: 'CompilerError', kind: 'ClauseSelectionError', message: 'dependency validation failed: ' + (e.message || JSON.stringify(e)) };
    }

    return resolved;
  };

  LicenseCompiler.prototype.resolveDependencies = function (names) {
    var resolved = names.slice();
    var visited = {};
    for (var i = 0; i < names.length; i++) visited[names[i]] = true;
    var stack = names.slice();
    while (stack.length) {
      var name = stack.pop();
      var clause = this.clauseDb.getByName(name);
      if (clause) {
        for (var d = 0; d < clause.dependencies.length; d++) {
          var dep = clause.dependencies[d];
          if (!visited[dep]) {
            visited[dep] = true;
            resolved.push(dep);
            stack.push(dep);
          }
        }
      }
    }
    return resolved;
  };

  LicenseCompiler.prototype.determineLicenseType = function (answers) {
    var lt = LicenseCompiler.getAnswerChoice(answers, 'license_type') || 'permissive';
    switch (lt) {
      case 'permissive': case 'bsd': case 'apache': case 'isc': return 'Permissive';
      case 'copyleft': return 'StrongCopyleft';
      case 'public_domain': return 'PublicDomain';
      case 'mpl': case 'lgpl': return 'WeakCopyleft';
      case 'network_copyleft': return 'NetworkCopyleft';
      case 'proprietary': return 'Proprietary';
      case 'commercial': return 'Commercial';
      default: return 'Custom';
    }
  };

  LicenseCompiler.prototype.determineSpdx = function (answers) {
    var Self = LicenseCompiler;
    var lictype = Self.getAnswerChoice(answers, 'license_type');
    if (!lictype) return null;
    var base;
    switch (lictype) {
      case 'permissive': base = 'MIT'; break;
      case 'copyleft': {
        var g = Self.getAnswerChoice(answers, 'gpl_version');
        if (g === '2.0-only') base = 'GPL-2.0-only';
        else if (g === '2.0-or-later') base = 'GPL-2.0-or-later';
        else if (g === '3.0-only') base = 'GPL-3.0-only';
        else base = 'GPL-3.0-or-later';
        break;
      }
      case 'public_domain': {
        var pd = Self.getAnswerChoice(answers, 'public_domain_variant');
        base = pd === 'cc0' ? 'CC0-1.0' : 'Unlicense';
        break;
      }
      case 'bsd': {
        var bsd = Self.getAnswerChoice(answers, 'bsd_variant');
        if (bsd === 'bsd-3') base = 'BSD-3-Clause';
        else if (bsd === 'bsd-4') base = 'BSD-4-Clause';
        else base = 'BSD-2-Clause';
        break;
      }
      case 'apache': base = 'Apache-2.0'; break;
      case 'isc': base = 'ISC'; break;
      case 'mpl': base = 'MPL-2.0'; break;
      case 'lgpl': {
        var l = Self.getAnswerChoice(answers, 'lgpl_version');
        if (l === '2.1-only') base = 'LGPL-2.1-only';
        else if (l === '2.1-or-later') base = 'LGPL-2.1-or-later';
        else if (l === '3.0-only') base = 'LGPL-3.0-only';
        else base = 'LGPL-3.0-or-later';
        break;
      }
      case 'network_copyleft': {
        var agpl = Self.getAnswerChoice(answers, 'agpl_version');
        base = agpl === '3.0-only' ? 'AGPL-3.0-only' : 'AGPL-3.0-or-later';
        break;
      }
      default: base = null;
    }

    var hasCustom =
      Self.getAnswerBoolean(answers, 'ai_training_restricted') ||
      Self.getAnswerBoolean(answers, 'military_restricted') ||
      Self.getAnswerBoolean(answers, 'nuclear_restricted') ||
      Self.getAnswerBoolean(answers, 'healthcare_restricted') ||
      Self.getAnswerBoolean(answers, 'export_control') ||
      Self.getAnswerBoolean(answers, 'no_commercial') ||
      Self.getAnswerBoolean(answers, 'drm_restriction') ||
      Self.getAnswerBoolean(answers, 'resale_restriction') ||
      Self.getAnswerBoolean(answers, 'privacy_no_telemetry');

    if (hasCustom && base) return null;
    return base;
  };

  LicenseCompiler.prototype.buildVariables = function (request) {
    var vars = {};
    vars.project_name = request.project_name;
    vars.year = String(request.year);
    if (request.copyright_holders && request.copyright_holders.length) {
      var first = request.copyright_holders[0];
      vars.copyright_holder = first.name;
      if (first.email) vars.commercial_contact = first.email;
      if (first.organization) vars.company_name = first.organization;
    } else {
      vars.copyright_holder = 'Copyright Holder';
    }
    if (request.dual_license) {
      vars.license_a = request.dual_license[0];
      vars.license_b = request.dual_license[1];
    }
    for (var i = 0; i < request.answers.length; i++) {
      var a = request.answers[i];
      var v = a.value;
      if (v && v.Text !== undefined && vars[a.question_id] === undefined) vars[a.question_id] = v.Text;
      else if (v && v.Choice !== undefined && vars[a.question_id] === undefined) vars[a.question_id] = v.Choice;
      else if (v && v.Number !== undefined && vars[a.question_id] === undefined) vars[a.question_id] = String(v.Number);
      else if (v && v.Boolean !== undefined && vars[a.question_id] === undefined) vars[a.question_id] = String(v.Boolean);
    }
    var defaults = {
      cla_url: 'https://example.com/cla',
      features_url: 'https://example.com/features',
      oem_contact: 'oem@example.com',
      warranty_days: '30',
      evaluation_days: '30',
      max_seats: '5',
      subscription_period: '1 month',
      pricing: 'see pricing page',
      expiration_date: '2027-01-01',
      change_date: '2027-01-01',
      change_license: 'Apache-2.0',
      allowed_uses: 'non-production use',
      core_license: 'MIT',
      commercial_conditions: 'you have obtained a commercial license'
    };
    for (var key in defaults) {
      if (vars[key] === undefined) vars[key] = defaults[key];
    }
    return vars;
  };

  LicenseCompiler.prototype.checkCompatibility = function (selected) {
    var warnings = [];
    for (var i = 0; i < selected.length; i++) {
      var name = selected[i];
      var clause = this.clauseDb.getByName(name);
      if (!clause) continue;
      for (var c = 0; c < clause.conflicts.length; c++) {
        var conf = clause.conflicts[c];
        if (selected.indexOf(conf) !== -1) {
          warnings.push({
            code: 'ConflictingClauses',
            message: "Clauses '" + name + "' and '" + conf + "' have conflicting terms",
            clause: name
          });
        }
      }
    }
    for (i = 0; i < selected.length; i++) {
      name = selected[i];
      clause = this.clauseDb.getByName(name);
      if (!clause) continue;
      for (var d = 0; d < clause.dependencies.length; d++) {
        var dep = clause.dependencies[d];
        if (selected.indexOf(dep) === -1) {
          warnings.push({
            code: 'MissingRecommended',
            message: "Clause '" + name + "' depends on '" + dep + "' which is not included",
            clause: name
          });
        }
      }
    }

    if (selected.indexOf('NETWORK-COPYLEFT') !== -1) {
      warnings.push({
        code: 'NetworkCopyleftDetected',
        message: 'Network copyleft (AGPL-style) clause detected. Modified versions used over a network must disclose source code.',
        clause: 'NETWORK-COPYLEFT'
      });
    }
    if (selected.indexOf('AI-TRAINING-RESTRICTION') !== -1) {
      warnings.push({
        code: 'AiRestrictionPresent',
        message: 'AI/ML training restriction clause present. This may limit downstream use in AI pipelines.',
        clause: 'AI-TRAINING-RESTRICTION'
      });
    }
    if (selected.indexOf('NO-COMMERCIAL') !== -1) {
      warnings.push({
        code: 'CommercialRestrictionPresent',
        message: 'Non-commercial restriction clause present. This restricts commercial use of the software.',
        clause: 'NO-COMMERCIAL'
      });
    }
    var hasPatent = selected.indexOf('APACHE-PATENT') !== -1 || selected.indexOf('PATENT-RETALIATION') !== -1;
    if (!hasPatent) {
      var hasCopyleft = selected.indexOf('GPL-COPYLEFT') !== -1 || selected.indexOf('MPL-CONDITION') !== -1;
      if (hasCopyleft) {
        warnings.push({
          code: 'PatentRisk',
          message: 'No explicit patent grant or retaliation clause in a copyleft license. Consider adding patent protection.',
          clause: null
        });
      }
    }
    return warnings;
  };

  LicenseCompiler.prototype.generateSuggestions = function (answers) {
    var Self = LicenseCompiler;
    var suggestions = [];
    var licenseType = Self.getAnswerChoice(answers, 'license_type') || 'permissive';
    var hasAttr = Self.getAnswerBoolean(answers, 'require_attribution');
    var hasCommercial = Self.getAnswerBoolean(answers, 'allow_commercial');
    var hasDeriv = Self.getAnswerBoolean(answers, 'allow_derivative_works');
    var hasSource = Self.getAnswerBoolean(answers, 'require_source_disclosure');
    var hasAi = Self.getAnswerBoolean(answers, 'ai_training_restricted');
    var hasPatent = Self.getAnswerBoolean(answers, 'require_patent_grant');

    if (licenseType === 'permissive' || licenseType === 'bsd' || licenseType === 'isc') {
      if (!hasAttr) suggestions.push('Consider requiring attribution to ensure credit is preserved across redistributions.');
      if (!hasCommercial) suggestions.push('This permissive license allows commercial use. If you want to restrict commercial use, consider adding the NO-COMMERCIAL restriction.');
    }
    if (licenseType === 'copyleft' || licenseType === 'network_copyleft') {
      if (!hasSource) suggestions.push('Consider requiring source code disclosure to ensure derivative works remain open.');
      if (licenseType === 'copyleft' && !hasAi) suggestions.push('If you want to prevent AI training on your code, consider adding the AI-TRAINING-RESTRICTION clause.');
    }
    if (licenseType === 'public_domain') {
      suggestions.push('Public domain dedications cannot be revoked. Ensure all copyright holders consent to the dedication.');
      suggestions.push('Consider patent implications. A public domain dedication covers copyright but may not cover patent rights.');
    }
    if (!hasPatent && (licenseType === 'apache' || licenseType === 'permissive')) {
      suggestions.push('Consider including a patent grant clause to protect users from patent litigation related to the software.');
    }
    if (!hasDeriv && (licenseType === 'permissive' || licenseType === 'bsd')) {
      suggestions.push('If you want to allow derivative works, consider adding the DERIVATIVE-WORKS-ALLOW clause.');
    }
    if (licenseType === 'permissive' || licenseType === 'bsd') {
      suggestions.push('Consider offering a dual license (open source + commercial) to allow commercial entities to purchase a proprietary license.');
    }
    if (licenseType === 'copyleft') {
      suggestions.push('Ensure all linked libraries are GPL-compatible. GPL copyleft requires that combined works also be GPL-licensed.');
    }
    if (licenseType === 'lgpl') {
      suggestions.push('LGPL allows linking from proprietary software under certain conditions. Ensure the static linking exception matches your intended use.');
    }
    if (licenseType === 'mpl') {
      suggestions.push('MPL applies at the file level. Modified MPL files must remain under MPL, but combining with other files is permitted.');
    }
    if (licenseType === 'network_copyleft') {
      suggestions.push('Network copyleft (AGPL-style) requires source disclosure for SaaS use. This may deter some commercial adoption.');
    }
    suggestions.push('Review the generated license with a legal professional before distribution.');
    if (hasAi) suggestions.push('AI training restrictions may be difficult to enforce in some jurisdictions. Consider consulting legal counsel.');
    return suggestions;
  };

  LicenseCompiler.prototype.buildHeader = function (request) {
    var holders = [];
    for (var i = 0; i < request.copyright_holders.length; i++) holders.push(request.copyright_holders[i].name);
    return 'Copyright (c) ' + request.year + ' ' + holders.join(', ') + '\n\n' + request.project_name;
  };

  LicenseCompiler.prototype.buildPreamble = function (request) {
    var licenseType = LicenseCompiler.getAnswerChoice(request.answers, 'license_type') || 'permissive';
    var desc;
    switch (licenseType) {
      case 'permissive': desc = 'a permissive license'; break;
      case 'copyleft': desc = 'a strong copyleft license'; break;
      case 'public_domain': desc = 'a public domain dedication'; break;
      case 'bsd': desc = 'a BSD license'; break;
      case 'apache': desc = 'the Apache License'; break;
      case 'isc': desc = 'an ISC license'; break;
      case 'mpl': desc = 'the Mozilla Public License'; break;
      case 'lgpl': desc = 'the GNU Lesser General Public License'; break;
      case 'network_copolit': desc = 'a network copyleft license'; break;
      case 'proprietary': desc = 'a proprietary license'; break;
      case 'commercial': desc = 'a commercial license'; break;
      default: desc = 'the following license';
    }
    return 'This software is made available under ' + desc + '. By using, copying, modifying, or distributing this software, you agree to be bound by the terms and conditions set forth below.';
  };

  LicenseCompiler.prototype.renderFullText = function (header, preamble, sections, footer) {
    var text = '';
    var sorted = sections.slice().sort(function (a, b) { return a.priority - b.priority; });
    if (header) text += header + '\n\n';
    if (preamble) text += preamble + '\n\n';
    for (var i = 0; i < sorted.length; i++) {
      if (sorted[i].content === '') continue;
      text += sorted[i].content + '\n\n';
    }
    if (footer) text += footer + '\n';
    return text;
  };

  LicenseCompiler.getAnswerBoolean = function (answers, id) { return getAnswerBoolean(answers, id); };
  LicenseCompiler.getAnswerChoice = function (answers, id) { return getAnswerChoice(answers, id); };
  LicenseCompiler.getAnswerMultiChoice = function (answers, id) { return getAnswerMultiChoice(answers, id); };
  LicenseCompiler.getAnswerText = function (answers, id) { return getAnswerText(answers, id); };
  LicenseCompiler.getAnswerNumber = function (answers, id) { return getAnswerNumber(answers, id); };

  function uuidV4() {
    var s = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
    return s.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0;
      var v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  NS.ClauseDatabase = ClauseDatabase;
  NS.LicenseCompiler = LicenseCompiler;
  NS.Compiler = {
    compile: function (request) { return new LicenseCompiler().compile(request); },
    ClauseDatabase: ClauseDatabase,
    LicenseCompiler: LicenseCompiler,
    helpers: {
      getAnswerBoolean: getAnswerBoolean,
      getAnswerChoice: getAnswerChoice,
      getAnswerMultiChoice: getAnswerMultiChoice,
      getAnswerText: getAnswerText,
      getAnswerNumber: getAnswerNumber
    }
  };
})();

// ---- engine-spdx.js ----
// Ported from src/spdx.rs (GLG Rust -> JS)
(function () {
  if (typeof window !== 'undefined') window.GLGEngine = window.GLGEngine || {};
  var NS = (typeof window !== 'undefined') ? window.GLGEngine :
           (typeof self !== 'undefined' ? self : globalThis).GLGEngine = (typeof self !== 'undefined' ? self : globalThis).GLGEngine || {};

  function data() { return GLG_DATA ? GLG_DATA.spdx : []; }

  function hasOwn(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  }

  function makeError(tag, message, payload) {
    var e = new Error(message);
    e.name = 'SpdxError';
    e.variant = tag;
    e.payload = payload;
    e.spdx = {};
    e.spdx[tag] = payload;
    return e;
  }

  function errInvalidSyntax(msg) {
    return makeError('InvalidSyntax', 'invalid SPDX expression syntax: ' + msg, msg);
  }

  function errParseError(msg) {
    return makeError('ParseError', 'parse error: ' + msg, msg);
  }

  function errUnknownLicense(id) {
    return makeError('UnknownLicense', 'unknown license identifier: ' + id, id);
  }

  function errIncompatibleCombination(a, b) {
    return makeError('IncompatibleCombination', 'incompatible license combination: ' + a + ' and ' + b, [a, b]);
  }

  function expr(operator, operands) {
    return { operator: operator, operands: operands };
  }

  function areCompatible(a, b) {
    if (a.category === 'Public Domain' || b.category === 'Public Domain') return true;
    if (a.category === 'Permissive' && b.category === 'Permissive') return true;
    if (a.category === 'Permissive' && (b.category === 'Weakly Copyleft' || b.category === 'Copyleft')) return true;
    if (b.category === 'Permissive' && (a.category === 'Weakly Copyleft' || a.category === 'Copyleft')) return true;
    if (a.category === 'Weakly Copyleft' && b.category === 'Weakly Copyleft') return true;
    if (a.category === 'Copyleft' && b.category === 'Permissive') return true;
    if (a.category === 'Permissive' && b.category === 'Copyleft') return true;
    if (a.category === b.category) return true;
    if (a.category === 'Non Commercial' || b.category === 'Non Commercial') return false;
    return false;
  }

  function computeCompatibility(license, all) {
    var out = [];
    var i;
    for (i = 0; i < all.length; i++) {
      if (all[i].id === license.id) continue;
      if (areCompatible(license, all[i])) out.push(all[i].id);
    }
    return out;
  }

  function SpdxDatabase(licenseMap, compatibility, list) {
    this.licenses = licenseMap;
    this.compatibility = compatibility;
    this.list = list;
  }

  SpdxDatabase.prototype.getLicense = function (id) {
    if (hasOwn(this.licenses, id)) return this.licenses[id];
    return null;
  };

  SpdxDatabase.prototype.search = function (query) {
    var q = String(query).toLowerCase();
    var out = [];
    var i, l;
    for (i = 0; i < this.list.length; i++) {
      l = this.list[i];
      if (l.id.toLowerCase().indexOf(q) !== -1 || l.name.toLowerCase().indexOf(q) !== -1) out.push(l);
    }
    return out;
  };

  SpdxDatabase.prototype.allIds = function () {
    var out = [];
    var i;
    for (i = 0; i < this.list.length; i++) out.push(this.list[i].id);
    return out;
  };

  SpdxDatabase.prototype.validateId = function (id) {
    return hasOwn(this.licenses, id);
  };

  SpdxDatabase.prototype.getCompatible = function (id) {
    if (hasOwn(this.compatibility, id)) return this.compatibility[id].slice();
    return [];
  };

  function buildDatabase(licenses) {
    var list = licenses || [];
    var licenseMap = {};
    var compatibility = {};
    var i, n = list.length;
    for (i = 0; i < n; i++) licenseMap[list[i].id] = list[i];
    for (i = 0; i < n; i++) compatibility[list[i].id] = computeCompatibility(list[i], list);
    return new SpdxDatabase(licenseMap, compatibility, list);
  }

  function load() {
    return buildDatabase(data());
  }

  function newFromJson(jsonString) {
    var arr;
    try {
      arr = JSON.parse(jsonString);
    } catch (e) {
      arr = [];
    }
    if (!(arr instanceof Array)) arr = [];
    return buildDatabase(arr);
  }

  function Parser(input) {
    this.input = input;
    this.pos = 0;
  }

  Parser.prototype.skipWhitespace = function () {
    var s = this.input;
    while (this.pos < s.length) {
      var c = s.charCodeAt(this.pos);
      if (c === 32 || c === 9 || c === 10 || c === 13) this.pos++;
      else break;
    }
  };

  Parser.prototype.peekWord = function () {
    var saved = this.pos;
    var p = this.pos;
    var s = this.input;
    while (p < s.length) {
      var c = s.charCodeAt(p);
      if (c === 32 || c === 9 || c === 10 || c === 13 || c === 40 || c === 41) break;
      p++;
    }
    if (p === saved) return null;
    return s.substring(saved, p);
  };

  Parser.prototype.consumeWord = function () {
    var word = this.peekWord();
    if (word === null) return null;
    this.pos += word.length;
    return word;
  };

  Parser.prototype.expect = function (expected) {
    this.skipWhitespace();
    var remaining = this.input.substring(this.pos);
    if (remaining.indexOf(expected) === 0) {
      this.pos += expected.length;
      return;
    }
    var show = remaining.substring(0, Math.min(remaining.length, expected.length + 10));
    throw errInvalidSyntax("expected '" + expected + "' at position " + this.pos + ", found '" + show + "'");
  };

  Parser.prototype.parseOperand = function () {
    this.skipWhitespace();
    if (this.pos >= this.input.length) {
      throw errParseError('unexpected end of expression');
    }
    var ch = this.input.charCodeAt(this.pos);
    if (ch === 40) {
      this.pos++;
      var inner = this.parseExpression(null);
      this.expect(')');
      return { Expression: inner };
    }
    var word = this.consumeWord();
    if (word === null) {
      throw errParseError('expected license identifier at position ' + this.pos);
    }
    if (word.indexOf('LicenseRef-') === 0) {
      return { LicenseRef: word.substring(11) };
    }
    if (word.indexOf('LicenseRef:') === 0) {
      return { LicenseRef: word.substring(11) };
    }
    if (word.indexOf('(') !== -1 || word.indexOf(')') !== -1) {
      throw errInvalidSyntax("unexpected character in license id: '" + word + "'");
    }
    return { LicenseId: word };
  };

  Parser.prototype.parseWithException = function (left) {
    this.skipWhitespace();
    var pos = this.pos;
    var current = this.input.substring(pos);
    if (current.indexOf('WITH') === 0) {
      var nextChars = this.input.substring(pos + 4);
      if (nextChars.length === 0 || nextChars.charCodeAt(0) === 32 || nextChars.charCodeAt(0) === 9) {
        this.pos += 4;
        var right = this.parseOperand();
        return expr('With', [left, right]);
      }
    }
    return expr('Plus', [left]);
  };

  Parser.prototype.detectOperator = function () {
    var remaining = this.input.substring(this.pos);
    if (remaining.indexOf('AND ') === 0 || remaining.indexOf('AND\u0000') === 0) return 'And';
    if (remaining.indexOf('OR ') === 0 || remaining.indexOf('OR\u0000') === 0) return 'Or';
    return null;
  };

  Parser.prototype.parseExpression = function (minPrecedence) {
    var precedence = (minPrecedence === null || minPrecedence === undefined) ? 0 : minPrecedence;
    var operand = this.parseOperand();

    this.skipWhitespace();
    var current = this.input.substring(this.pos);
    if (current.charAt(0) === '+') {
      var next = this.input.substring(this.pos + 1);
      var atEnd = next.length === 0 ||
        next.charCodeAt(0) === 32 || next.charCodeAt(0) === 9 ||
        next.charCodeAt(0) === 10 || next.charCodeAt(0) === 13 || next.charCodeAt(0) === 41;
      if (atEnd) {
        this.pos++;
        operand = { Expression: expr('Plus', [operand]) };
      }
    }

    var left = this.parseWithException(operand);

    for (;;) {
      this.skipWhitespace();
      var op = this.detectOperator();
      var opPrec = 0;
      if (op === 'And') opPrec = 2;
      else if (op === 'Or') opPrec = 1;
      else break;

      if (opPrec < precedence) break;

      this.pos += (op === 'And') ? 3 : 2;
      var right = this.parseExpression(opPrec + 1);

      left = expr(op, [{ Expression: left }, { Expression: right }]);
    }

    return left;
  };

  function parse(expression) {
    var s = (expression === null || expression === undefined) ? '' : expression;
    var trimmed = String(s).trim();
    if (trimmed.length === 0) throw errInvalidSyntax('empty expression');

    var parser = new Parser(trimmed);
    var result = parser.parseExpression(null);
    parser.skipWhitespace();

    if (parser.pos < parser.input.length) {
      throw errInvalidSyntax("unexpected trailing content: '" + parser.input.substring(parser.pos) + "'");
    }

    return result;
  }

  function operandToString(outerOperator, operand) {
    if (typeof operand.LicenseId === 'string') return operand.LicenseId;
    if (typeof operand.LicenseRef === 'string') return 'LicenseRef-' + operand.LicenseRef;
    var inner = expressionToString(operand.Expression);
    if (outerOperator === 'Plus' || outerOperator === 'With') {
      var eop = operand.Expression.operator;
      if (eop === 'And' || eop === 'Or') return '(' + inner + ')';
      return inner;
    }
    return inner;
  }

  function expressionToString(exprObj) {
    var op = exprObj.operator;
    if (op === 'Plus') {
      if (exprObj.operands.length > 0) return operandToString('Plus', exprObj.operands[0]) + '+';
      return '+';
    }
    if (op === 'With') {
      var l = exprObj.operands.length > 0 ? operandToString('With', exprObj.operands[0]) : '';
      var r = exprObj.operands.length > 1 ? operandToString('With', exprObj.operands[1]) : '';
      return l + ' WITH ' + r;
    }
    var parts = [];
    for (var i = 0; i < exprObj.operands.length; i++) parts.push(operandToString(op, exprObj.operands[i]));
    return parts.join(op === 'And' ? ' AND ' : ' OR ');
  }

  function operandLicenseId(operand) {
    if (typeof operand.LicenseId === 'string') return operand.LicenseId;
    if (operand.Expression) {
      if (operand.Expression.operands.length > 0) return operandLicenseId(operand.Expression.operands[0]);
      return null;
    }
    return null;
  }

  function expressionValidate(exprObj, db) {
    var i, j;
    for (i = 0; i < exprObj.operands.length; i++) {
      var o = exprObj.operands[i];
      if (typeof o.LicenseId === 'string') {
        if (!db.validateId(o.LicenseId)) throw errUnknownLicense(o.LicenseId);
      } else if (o.Expression) {
        expressionValidate(o.Expression, db);
      }
    }
    if (exprObj.operator === 'And') {
      for (i = 0; i < exprObj.operands.length; i++) {
        for (j = i + 1; j < exprObj.operands.length; j++) {
          var a = operandLicenseId(exprObj.operands[i]);
          var b = operandLicenseId(exprObj.operands[j]);
          if (a !== null && b !== null) {
            if (db.getCompatible(a).indexOf(b) === -1) throw errIncompatibleCombination(a, b);
          }
        }
      }
    }
    return null;
  }

  var UUID_NAMESPACE_URL = [0x6b, 0xa7, 0xb8, 0x11, 0x9d, 0xad, 0x11, 0xd1, 0x80, 0xb4, 0x00, 0xc0, 0x4f, 0xd4, 0x30, 0xc8];

  function utf8Bytes(str) {
    var latin1 = unescape(encodeURIComponent(str));
    var out = [];
    var i;
    for (i = 0; i < latin1.length; i++) out.push(latin1.charCodeAt(i));
    return out;
  }

  function sha1Bytes(message) {
    var i, t;
    var ml = message.length;
    var n = ((ml + 8) >> 6) + 1;
    var blocks = [];
    for (i = 0; i < n * 16; i++) blocks[i] = 0;
    for (i = 0; i < ml; i++) blocks[i >> 2] |= message[i] << (24 - (i % 4) * 8);
    blocks[i >> 2] |= 0x80 << (24 - (i % 4) * 8);
    blocks[n * 16 - 1] = ml * 8;

    var h = [0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0];
    var w = [];
    for (t = 0; t < n * 16; t += 16) {
      for (i = 0; i < 16; i++) w[i] = blocks[t + i];
      for (i = 16; i < 80; i++) {
        w[i] = ((w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16]) << 1) | ((w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16]) >>> 31);
      }
      var a = h[0], b = h[1], c = h[2], d = h[3], e = h[4];
      var f, k, temp;
      for (i = 0; i < 80; i++) {
        if (i < 20) { f = (b & c) | (~b & d); k = 0x5A827999; }
        else if (i < 40) { f = b ^ c ^ d; k = 0x6ED9EBA1; }
        else if (i < 60) { f = (b & c) | (b & d) | (c & d); k = 0x8F1BBCDC; }
        else { f = b ^ c ^ d; k = 0xCA62C1D6; }
        temp = (((a << 5) | (a >>> 27)) + f + e + k + w[i]) | 0;
        e = d; d = c; c = (b << 30) | (b >>> 2); b = a; a = temp;
      }
      h[0] = (h[0] + a) | 0; h[1] = (h[1] + b) | 0;
      h[2] = (h[2] + c) | 0; h[3] = (h[3] + d) | 0; h[4] = (h[4] + e) | 0;
    }

    var out = [];
    for (i = 0; i < 20; i++) out[i] = (h[i >> 2] >>> (24 - (i % 4) * 8)) & 0xff;
    return out;
  }

  function bytesToHex(bytes) {
    var hex = '0123456789abcdef';
    var s = '';
    var i;
    for (i = 0; i < bytes.length; i++) s += hex.charAt(bytes[i] >> 4) + hex.charAt(bytes[i] & 15);
    return s;
  }

  function formatUuid(bytes) {
    var h = bytesToHex(bytes);
    return h.substring(0, 8) + '-' + h.substring(8, 12) + '-' + h.substring(12, 16) + '-' + h.substring(16, 20) + '-' + h.substring(20, 32);
  }

  function uuidV5(namespaceBytes, nameBytes) {
    var hash = sha1Bytes(namespaceBytes.concat(nameBytes));
    hash[6] = (hash[6] & 0x0f) | 0x50;
    hash[8] = (hash[8] & 0x3f) | 0x80;
    return hash;
  }

  function toLicenseRef(customName) {
    var name = String(customName);
    var sanitized = name.replace(/[^A-Za-z0-9\-_.]/g, '-');
    var hash = uuidV5(UUID_NAMESPACE_URL, utf8Bytes(name));
    var shortId = bytesToHex(hash).substring(0, 8);
    return 'LicenseRef-' + sanitized + '-' + shortId;
  }

  function generateUniqueId() {
    var bytes = [];
    var i;
    for (i = 0; i < 16; i++) bytes.push(Math.floor(Math.random() * 256));
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    return formatUuid(bytes);
  }

  var defaultDbCache = null;

  function defaultDb() {
    if (!defaultDbCache) defaultDbCache = load();
    return defaultDbCache;
  }

  function validateId(id, db) {
    return (db || defaultDb()).validateId(id);
  }

  function getLicense(id, db) {
    return (db || defaultDb()).getLicense(id);
  }

  function search(query, db) {
    return (db || defaultDb()).search(query);
  }

  function allIds(db) {
    return (db || defaultDb()).allIds();
  }

  function getCompatible(id, db) {
    return (db || defaultDb()).getCompatible(id);
  }

  function validate(exprObj, db) {
    return expressionValidate(exprObj, db || defaultDb());
  }

  NS.Spdx = {
    parse: parse,
    toString: expressionToString,
    validate: validate,
    validateId: validateId,
    lookup: getLicense,
    getLicense: getLicense,
    search: search,
    allIds: allIds,
    getCompatible: getCompatible,
    load: load,
    newFromJson: newFromJson,
    toLicenseRef: toLicenseRef,
    generateUniqueId: generateUniqueId,
    Operator: {
      And: 'And',
      Or: 'Or',
      With: 'With',
      Plus: 'Plus'
    }
  };
})();

// ---- engine-compat.js ----
// Ported from src/compatibility.rs (GLG Rust -> JS)
(function () {
  if (typeof window !== 'undefined') window.GLGEngine = window.GLGEngine || {};
  var NS = (typeof window !== 'undefined') ? window.GLGEngine :
           (typeof self !== 'undefined' ? self : globalThis).GLGEngine = (typeof self !== 'undefined' ? self : globalThis).GLGEngine || {};

  var data = null;
  var ROOT = (typeof window !== 'undefined') ? window : (typeof self !== 'undefined' ? self : globalThis);

  function load() {
    if (ROOT.GLG_DATA && ROOT.GLG_DATA.compatibility) {
      data = ROOT.GLG_DATA.compatibility;
    } else {
      data = { matrix: {}, upgrade_paths: {} };
    }
    return data;
  }

  function matrixData() {
    if (!data) load();
    return data.matrix;
  }

  function upgradeData() {
    if (!data) load();
    return data.upgrade_paths;
  }

  function areCompatible(a, b) {
    var m = matrixData();
    if (m[a] && Object.prototype.hasOwnProperty.call(m[a], b)) {
      return m[a][b];
    }
    if (m[b] && Object.prototype.hasOwnProperty.call(m[b], a)) {
      return m[b][a];
    }
    return false;
  }

  function getCompatibleLicenses(license) {
    var m = matrixData();
    var row = m[license];
    if (!row) return [];
    var out = [];
    for (var k in row) {
      if (Object.prototype.hasOwnProperty.call(row, k) && row[k] === true) {
        out.push(k);
      }
    }
    return out;
  }

  function getIncompatibleLicenses(license) {
    var m = matrixData();
    var row = m[license];
    if (!row) return [];
    var out = [];
    for (var k in row) {
      if (Object.prototype.hasOwnProperty.call(row, k) && row[k] === false) {
        out.push(k);
      }
    }
    return out;
  }

  function findUpgrade(license) {
    var up = upgradeData();
    if (Object.prototype.hasOwnProperty.call(up, license)) {
      return up[license].slice();
    }
    return [];
  }

  function explain(a, b) {
    var compatible = areCompatible(a, b);
    var reason = compatible
      ? a + " and " + b + " are compatible"
      : a + " and " + b + " are incompatible";
    var suggestions = [];

    if (!compatible) {
      var upgradesA = upgradeData()[a] || [];
      for (var i = 0; i < upgradesA.length; i++) {
        var upA = upgradesA[i];
        if (areCompatible(upA, b)) {
          suggestions.push("Upgrade " + a + " to " + upA + " for compatibility with " + b);
        }
      }

      var upgradesB = upgradeData()[b] || [];
      for (var j = 0; j < upgradesB.length; j++) {
        var upB = upgradesB[j];
        if (areCompatible(a, upB)) {
          suggestions.push("Upgrade " + b + " to " + upB + " for compatibility with " + a);
        }
      }

      var compA = getCompatibleLicenses(a);
      var compB = getCompatibleLicenses(b);
      var common = [];
      for (var k = 0; k < compA.length; k++) {
        if (compB.indexOf(compA[k]) !== -1) {
          common.push(compA[k]);
        }
      }

      if (common.length) {
        suggestions.push("Consider using one of these mutually compatible licenses: " + common.join(", "));
      }
    }

    return {
      license_a: a,
      license_b: b,
      compatible: compatible,
      reason: reason,
      suggestions: suggestions
    };
  }

  function checkBatch(licenses) {
    var pairwise_results = [];
    var conflicts = [];
    var all_suggestions = [];

    for (var i = 0; i < licenses.length; i++) {
      for (var j = i + 1; j < licenses.length; j++) {
        var result = explain(licenses[i], licenses[j]);
        if (!result.compatible) {
          conflicts.push([licenses[i], licenses[j]]);
          for (var s = 0; s < result.suggestions.length; s++) {
            if (all_suggestions.indexOf(result.suggestions[s]) === -1) {
              all_suggestions.push(result.suggestions[s]);
            }
          }
        }
        pairwise_results.push(result);
      }
    }

    var overall_compatible = conflicts.length === 0;

    if (!overall_compatible) {
      var parts = [];
      for (var c = 0; c < conflicts.length; c++) {
        parts.push(conflicts[c][0] + " <-> " + conflicts[c][1]);
      }
      var msg = "Found " + conflicts.length + " incompatible pair(s): " + parts.join(", ");
      if (all_suggestions.indexOf(msg) === -1) {
        all_suggestions.push(msg);
      }
    }

    return {
      licenses: licenses.slice(),
      pairwise_results: pairwise_results,
      overall_compatible: overall_compatible,
      conflicts: conflicts,
      suggestions: all_suggestions
    };
  }

  function allLicenseIds() {
    return Object.keys(matrixData()).sort();
  }

  function getMatrixDisplay() {
    var ids = allLicenseIds();
    var display = [];
    var header = [""];
    for (var h = 0; h < ids.length; h++) {
      header.push(ids[h]);
    }
    display.push(header);

    for (var i = 0; i < ids.length; i++) {
      var row = [ids[i]];
      for (var j = 0; j < ids.length; j++) {
        row.push(areCompatible(ids[i], ids[j]) ? "Y" : "N");
      }
      display.push(row);
    }
    return display;
  }

  NS.Compat = {
    areCompatible: areCompatible,
    getCompatibleLicenses: getCompatibleLicenses,
    getIncompatibleLicenses: getIncompatibleLicenses,
    findUpgrade: findUpgrade,
    checkBatch: checkBatch,
    explain: explain,
    allLicenseIds: allLicenseIds,
    getMatrixDisplay: getMatrixDisplay
  };
})();

// ---- engine-validate.js ----
// Ported from src/validator.rs (GLG Rust -> JS)
(function(){
  if (typeof window !== 'undefined') window.GLGEngine = window.GLGEngine || {};
  var NS = (typeof window !== 'undefined') ? window.GLGEngine :
           (typeof self !== 'undefined' ? self : globalThis).GLGEngine = (typeof self !== 'undefined' ? self : globalThis).GLGEngine || {};

  var MIN_TEXT_LENGTH = 50;
  var MAX_TEXT_LENGTH = 100000;

  var COMMON_COPYRIGHT_KEYWORDS = ["copyright", "(c)", "(C)", "all rights reserved"];
  var COMMON_WARRANTY_KEYWORDS = ["warranty", "disclaim", "as is", "as-is", "without warranty", "no warranty", "provided \"as is\""];

  var KNOWN_TEMPLATE_VARIABLES = {
    "year": true, "copyright_holder": true, "project_name": true,
    "commercial_contact": true, "license_a": true, "license_b": true,
    "change_date": true, "change_license": true, "allowed_uses": true,
    "cla_url": true, "company_name": true, "core_license": true,
    "features_url": true, "oem_contact": true, "warranty_days": true,
    "expiration_date": true, "subscription_period": true, "pricing": true,
    "evaluation_days": true, "max_seats": true, "commercial_conditions": true
  };

  var SPDX_DB_JSON = '{"MIT":1,"Apache-2.0":1,"GPL-2.0-only":1,"GPL-2.0-or-later":1,"GPL-3.0-only":1,"GPL-3.0-or-later":1,"LGPL-2.1-only":1,"LGPL-2.1-or-later":1,"LGPL-3.0-only":1,"LGPL-3.0-or-later":1,"BSD-2-Clause":1,"BSD-3-Clause":1,"BSD-4-Clause":0,"ISC":1,"MPL-2.0":1,"AGPL-3.0-only":1,"AGPL-3.0-or-later":1,"Unlicense":1,"0BSD":1,"CC0-1.0":1,"CC-BY-4.0":1,"CC-BY-SA-4.0":1,"Zlib":1,"Artistic-2.0":1,"BSL-1.0":1,"EPL-1.0":1,"EPL-2.0":1,"EUPL-1.1":1,"EUPL-1.2":1,"IPA":1,"LATEX2e":1,"LiliQ-R-1.1":1,"LiliQ-Rplus-1.1":1,"LiliQ-R-Spec-1.1":1,"LiliQ-Rplus-Spec-1.1":1,"MS-PL":1,"MS-RL":1,"NCSA":1,"OFL-1.1":1,"OSL-3.0":1,"PostgreSQL":1,"Python-2.0":1,"QPL-1.0":1,"Ruby":0,"SGI-B-1.0":0,"SSH-OpenSSH":0,"Unicode-DFS-2016":1,"UPL-1.0":1,"VCL-1.0":0,"W3C":1,"WTFPL":0,"X11":0,"Xnet":1,"ZPL-2.1":0,"CC-PDDC":0,"CC-BY-1.0":0,"CC-BY-2.0":0,"CC-BY-2.5":0,"CC-BY-3.0":0,"CC-BY-SA-1.0":0,"CC-BY-SA-2.0":0,"CC-BY-SA-2.5":0,"CC-BY-SA-3.0":0,"CC-BY-NC-1.0":0,"CC-BY-NC-2.0":0,"CC-BY-NC-2.5":0,"CC-BY-NC-3.0":0,"CC-BY-NC-4.0":0,"CC-BY-NC-SA-1.0":0,"CC-BY-NC-SA-2.0":0,"CC-BY-NC-SA-2.5":0,"CC-BY-NC-SA-3.0":0,"CC-BY-NC-SA-4.0":0,"CC-BY-ND-1.0":0,"CC-BY-ND-2.0":0,"CC-BY-ND-2.5":0,"CC-BY-ND-3.0":0,"CC-BY-ND-4.0":0,"OLDAP-2.7":1,"OLDAP-2.8":1,"PHP-3.0":1,"OFL-1.1-no-rfn":1,"OFL-1.1-rfn":1,"CDDL-1.0":1,"CDDL-1.1":1,"CPL-1.0":1}';
  var CLAUSE_DB_JSON = '[["MIT-PERMISSION","permission",[],["NO-COMMERCIAL","RESTRICTED-USE"]],["MIT-CONDITION","condition",["MIT-PERMISSION"],[]],["MIT-WARRANTY","warranty",[],[]],["APACHE-PERMISSION","permission",[],["NO-COMMERCIAL"]],["APACHE-PATENT","patent",["APACHE-PERMISSION"],["NO-PATENT-GRANT"]],["GPL-COPYLEFT","condition",[],["NO-COPYLEFT","PROPRIETARY"]],["BSD-2-PERMISSION","permission",[],["NO-COMMERCIAL"]],["BSD-2-DISCLAIMER","warranty",[],[]],["BSD-3-ADVERTISING","condition",["BSD-2-PERMISSION"],[]],["ISC-PERMISSION","permission",[],["NO-COMMERCIAL"]],["ISC-DISCLAIMER","warranty",[],[]],["UNLICENSE","permission",[],["COPYRIGHT-ONLY","PROPRIETARY","COMMERCIAL-EXCEPTION"]],["CC0-PERMISSION","permission",[],["COPYRIGHT-ONLY","PROPRIETARY"]],["MPL-CONDITION","condition",[],["PROPRIETARY"]],["LGPL-STATIC","condition",[],["PROPRIETARY"]],["PATENT-RETALIATION","patent",[],[]],["NO-COMMERCIAL","restriction",[],["MIT-PERMISSION","BSD-2-PERMISSION","ISC-PERMISSION","APACHE-PERMISSION"]],["ATTRIBUTION","condition",[],[]],["NO-TRADemark","restriction",[],[]],["SOURCE-DISCLOSURE","condition",[],["PROPRIETARY"]],["NETWORK-COPYLEFT","condition",[],["PROPRIETARY","NO-COPYLEFT"]],["COPYRIGHT-NOTICE","condition",[],[]],["DUAL-LICENSE","meta",[],["SINGLE-LICENSE"]],["BUSL-RESTRICTION","restriction",[],[]],["SSPL-CONDITION","condition",[],["PROPRIETARY"]],["POLYFORM-RESTRICTION","restriction",[],[]],["AI-TRAINING-RESTRICTION","restriction",[],[]],["EXPORT-CONTROL","compliance",[],[]],["TERMINATION","termination",[],[]],["REVISION","meta",[],[]],["GOVERNMENT-USE","permission",[],[]],["CONTRIBUTION-CLA","meta",[],[]],["DRM-RESTRICTION","restriction",[],[]],["SUBSCRIPTION-LICENSE","commercial",[],[]],["EVALUATION-LICENSE","commercial",[],[]],["OPEN-CORE","commercial",[],[]],["TELEMETRY-NOTICE","privacy",[],["PRIVACY-NO-TELEMETRY"]],["HEALTHCARE-RESTRICTION","compliance",[],[]],["NUCLEAR-RESTRICTION","compliance",[],[]],["MILITARY-RESTRICTION","compliance",[],[]],["DERIVATIVE-WORKS-ALLOW","permission",[],["NO-DERIVATIVES"]],["NO-DERIVATIVES","restriction",[],["DERIVATIVE-WORKS-ALLOW","GPL-COPYLEFT","MIT-PERMISSION","BSD-2-PERMISSION","ISC-PERMISSION"]],["PER-SEAT-LICENSE","commercial",[],[]],["PER-COMPANY-LICENSE","commercial",[],[]],["RESALE-RESTRICTION","restriction",[],[]],["CLOUD-HOSTING","permission",[],[]],["CONTAINER-RIGHTS","permission",[],[]],["OEM-LICENSE","commercial",[],[]],["WARRANTY-PROVIDED","warranty",[],["MIT-WARRANTY","BSD-2-DISCLAIMER","ISC-DISCLAIMER"]],["LIABILITY-CAPPED","liability",[],[]],["EXPIRATION","termination",[],[]],["PRIVACY-NO-TELEMETRY","privacy",[],["TELEMETRY-NOTICE"]],["EDUCATION-EXCEPTION","permission",[],[]],["NONPROFIT-EXCEPTION","permission",[],[]],["COMMERICAL-EXCEPTION","commercial",[],[]]]';

  function buildSpdxDb() {
    var map = JSON.parse(SPDX_DB_JSON);
    var out = {};
    for (var k in map) {
      if (Object.prototype.hasOwnProperty.call(map, k)) out[k] = !!map[k];
    }
    return out;
  }

  function buildClauseDb() {
    var rows = JSON.parse(CLAUSE_DB_JSON);
    var out = [];
    for (var i = 0; i < rows.length; i++) {
      out.push({ name: rows[i][0], category: rows[i][1], dependencies: rows[i][2], conflicts: rows[i][3] });
    }
    return out;
  }

  var SPDX_DB = buildSpdxDb();
  var CLAUSE_DB = buildClauseDb();

  function utf8ByteLength(str) {
    var len = 0;
    for (var i = 0; i < str.length; i++) {
      var c = str.charCodeAt(i);
      if (c < 128) {
        len += 1;
      } else if (c < 2048) {
        len += 2;
      } else if (c >= 55296 && c <= 56319 && i + 1 < str.length) {
        var c2 = str.charCodeAt(i + 1);
        if (c2 >= 56320 && c2 <= 57343) {
          len += 4;
          i++;
        } else {
          len += 3;
        }
      } else {
        len += 3;
      }
    }
    return len;
  }

  function coerceText(text) {
    if (text == null) return "";
    return String(text);
  }

  function hasAnyKeyword(lowerText, keywords) {
    for (var i = 0; i < keywords.length; i++) {
      if (lowerText.indexOf(keywords[i]) !== -1) return true;
    }
    return false;
  }

  function errorMissingClause(clause) {
    return { type: "MissingClause", clause: clause, message: "Missing required clause: " + clause };
  }

  function errorConflictingClauses(clauseA, clauseB) {
    return { type: "ConflictingClauses", clause_a: clauseA, clause_b: clauseB, message: "Conflicting clauses: " + clauseA + " and " + clauseB };
  }

  function errorInvalidSpdx(identifier) {
    return { type: "InvalidSpdx", identifier: identifier, message: "Invalid SPDX identifier: " + identifier };
  }

  function errorBrokenReference(reference) {
    return { type: "BrokenReference", reference: reference, message: "Broken reference: " + reference };
  }

  function errorMissingCopyrightNotice() {
    return { type: "MissingCopyrightNotice", message: "Missing copyright notice" };
  }

  function errorMissingWarrantyDisclaimer() {
    return { type: "MissingWarrantyDisclaimer", message: "Missing warranty disclaimer" };
  }

  function errorInvalidTemplateVariable(variable, clause) {
    return { type: "InvalidTemplateVariable", variable: variable, clause: clause, message: "Invalid template variable: " + variable + " in clause " + clause };
  }

  function errorTooShort(length) {
    return { type: "TooShort", length: length, message: "License text too short: " + length + " characters" };
  }

  function errorTooLong(length) {
    return { type: "TooLong", length: length, message: "License text too long: " + length + " characters" };
  }

  function warnNonStandardSpdx(identifier) {
    return { type: "NonStandardSpdx", identifier: identifier, message: "Non-standard SPDX identifier: " + identifier };
  }

  function warnPotentiallyConflicting(clauseA, clauseB) {
    return { type: "PotentiallyConflicting", clause_a: clauseA, clause_b: clauseB, message: "Potentially conflicting clause combination: " + clauseA + ", " + clauseB };
  }

  function warnMissingRecommended(clause) {
    return { type: "MissingRecommended", clause: clause, message: "Missing recommended clause: " + clause };
  }

  function warnUnusualOrdering() {
    return { type: "UnusualOrdering", message: "Unusual clause ordering" };
  }

  function warnMayNotBeOsiApproved() {
    return { type: "MayNotBeOsiApproved", message: "License may not be OSI approved" };
  }

  function spdxHas(id) {
    return Object.prototype.hasOwnProperty.call(SPDX_DB, id);
  }

  function getClauseByName(name) {
    for (var i = 0; i < CLAUSE_DB.length; i++) {
      if (CLAUSE_DB[i].name === name) return CLAUSE_DB[i];
    }
    return null;
  }

  function checkConflicts(names) {
    var included = [];
    var i, j, k;
    for (i = 0; i < names.length; i++) {
      var found = getClauseByName(names[i]);
      if (found) included.push(found);
    }
    for (i = 0; i < included.length; i++) {
      var conflicts = included[i].conflicts;
      for (j = 0; j < conflicts.length; j++) {
        var conflictName = conflicts[j];
        for (k = 0; k < names.length; k++) {
          if (names[k] === conflictName) {
            return { kind: "ConflictingClauses", a: included[i].name, b: conflictName };
          }
        }
      }
    }
    return null;
  }

  function validateDependencies(names) {
    var resolved = [];
    var i, j, k;
    for (i = 0; i < names.length; i++) {
      var name = names[i];
      var clause = getClauseByName(name);
      if (!clause) return { kind: "NotFound", name: name };
      resolved.push(clause);
      for (j = 0; j < clause.dependencies.length; j++) {
        var dep = clause.dependencies[j];
        var depInNames = false;
        for (k = 0; k < names.length; k++) {
          if (names[k] === dep) {
            depInNames = true;
            break;
          }
        }
        if (!depInNames) {
          return { kind: "MissingDependency", clause: name, dependency: dep };
        }
        var depResolved = false;
        for (k = 0; k < resolved.length; k++) {
          if (resolved[k].name === dep) {
            depResolved = true;
            break;
          }
        }
        if (!depResolved) {
          var depClause = getClauseByName(dep);
          if (!depClause) return { kind: "NotFound", name: dep };
          resolved.push(depClause);
        }
      }
    }
    return { kind: "Ok", resolved: resolved };
  }

  function warningsFromDependencyError(dependency, errors) {
    errors.push(errorMissingClause(dependency));
  }

  function normalizedClauseCategory(clause) {
    if (!clause || clause.category == null) return "";
    return String(clause.category).toLowerCase();
  }

  function LicenseValidator() {
    this.clause_db = CLAUSE_DB;
    this.spdx_db = SPDX_DB;
  }

  LicenseValidator.prototype.validateStructure = function(text) {
    text = coerceText(text);
    var errors = [];
    var length = utf8ByteLength(text);
    if (length < MIN_TEXT_LENGTH) {
      errors.push(errorTooShort(length));
    }
    if (length > MAX_TEXT_LENGTH) {
      errors.push(errorTooLong(length));
    }
    return errors;
  };

  LicenseValidator.prototype.validateTemplateVariables = function(text) {
    text = coerceText(text);
    var errors = [];
    var re = /\{([a-zA-Z_][a-zA-Z0-9_]*)\}/g;
    var match;
    while ((match = re.exec(text)) !== null) {
      var varName = match[1];
      if (!Object.prototype.hasOwnProperty.call(KNOWN_TEMPLATE_VARIABLES, varName)) {
        errors.push(errorInvalidTemplateVariable(varName, ""));
      }
    }
    return errors;
  };

  LicenseValidator.prototype.validateSpdx = function(spdxId) {
    if (typeof spdxId !== "string") spdxId = (spdxId == null) ? "" : String(spdxId);
    return spdxHas(spdxId);
  };

  LicenseValidator.prototype.validateClauses = function(clauses) {
    var errors = [];
    clauses = clauses || [];
    var i, j;
    var clauseNames = [];
    for (i = 0; i < clauses.length; i++) {
      clauseNames.push(clauses[i].name);
    }

    var conflict = checkConflicts(clauseNames);
    if (conflict) {
      errors.push(errorConflictingClauses(conflict.a, conflict.b));
    }

    var depResult = validateDependencies(clauseNames);
    if (depResult.kind === "MissingDependency") {
      errors.push(errorMissingClause(depResult.dependency));
      warningsFromDependencyError(depResult.dependency, errors);
    } else if (depResult.kind === "NotFound") {
      errors.push(errorBrokenReference(depResult.name));
    }

    for (i = 0; i < clauses.length; i++) {
      var templateErrors = this.validateTemplateVariables(clauses[i].content);
      for (j = 0; j < templateErrors.length; j++) {
        var err = templateErrors[j];
        if (err.type === "InvalidTemplateVariable") {
          errors.push(errorInvalidTemplateVariable(err.variable, clauses[i].name));
        }
      }
    }

    return errors;
  };

  LicenseValidator.prototype.checkCompleteness = function(license) {
    license = license || {};
    var metadata = license.metadata || {};
    var score = 0;
    var totalChecks = 12;

    if ((metadata.name || "").trim() !== "") score += 1;
    if ((metadata.description || "").trim() !== "") score += 1;
    if ((metadata.authors || []).length > 0) score += 1;
    if ((license.preamble || "").trim() !== "") score += 1;
    if ((license.clauses || []).length > 0) score += 1;
    if ((license.warranty_disclaimer || "").trim() !== "") score += 1;

    var textLower = (license.full_text || "").toLowerCase();
    if (hasAnyKeyword(textLower, COMMON_COPYRIGHT_KEYWORDS)) score += 1;
    if (hasAnyKeyword(textLower, COMMON_WARRANTY_KEYWORDS)) score += 1;

    if (metadata.spdx_id != null) score += 1;
    if ((license.conditions || []).length > 0) score += 1;
    if ((license.permissions || []).length > 0) score += 1;
    if (license.patent_grant != null) score += 1;

    var percentage = Math.floor((score * 100) / totalChecks);
    return percentage < 100 ? percentage : 100;
  };

  LicenseValidator.prototype.checkPotentialConflicts = function(clauseNames, warnings) {
    var restrictionClauses = [];
    var permissionClauses = [];
    var i, j, name, clause;
    for (i = 0; i < clauseNames.length; i++) {
      name = clauseNames[i];
      clause = getClauseByName(name);
      if (clause) {
        if (clause.category === "restriction") restrictionClauses.push(name);
        if (clause.category === "permission") permissionClauses.push(name);
      }
    }

    if (restrictionClauses.length > 2 && permissionClauses.length < 2) {
      for (i = 0; i < restrictionClauses.length; i++) {
        for (j = i + 1; j < restrictionClauses.length; j++) {
          var a = getClauseByName(restrictionClauses[i]);
          var b = getClauseByName(restrictionClauses[j]);
          if (a && b) {
            if (a.conflicts.indexOf(b.name) === -1 && b.conflicts.indexOf(a.name) === -1) {
              warnings.push(warnPotentiallyConflicting(a.name, b.name));
            }
          }
        }
      }
    }

    for (i = 0; i < clauseNames.length; i++) {
      name = clauseNames[i];
      clause = getClauseByName(name);
      if (clause && clause.category === "warranty") {
        var hasOtherWarranty = false;
        for (j = 0; j < clauseNames.length; j++) {
          var other = clauseNames[j];
          if (other !== name) {
            var oc = getClauseByName(other);
            if (oc && oc.category === "warranty") {
              hasOtherWarranty = true;
              break;
            }
          }
        }
        if (hasOtherWarranty) {
          warnings.push(warnPotentiallyConflicting(name, "multiple warranty clauses present"));
        }
      }
    }
  };

  LicenseValidator.prototype.validateText = function(text) {
    text = coerceText(text);
    var errors = [];
    var warnings = [];
    var i;

    var textErrors = this.validateStructure(text);
    for (i = 0; i < textErrors.length; i++) errors.push(textErrors[i]);

    var templateErrors = this.validateTemplateVariables(text);
    for (i = 0; i < templateErrors.length; i++) errors.push(templateErrors[i]);

    var textLower = text.toLowerCase();
    if (!hasAnyKeyword(textLower, COMMON_COPYRIGHT_KEYWORDS)) {
      errors.push(errorMissingCopyrightNotice());
    }

    if (!hasAnyKeyword(textLower, COMMON_WARRANTY_KEYWORDS)) {
      errors.push(errorMissingWarrantyDisclaimer());
    }

    var length = utf8ByteLength(text);
    if (errors.length === 0 && length < 200) {
      warnings.push(warnMissingRecommended("More detailed permission grant"));
    }

    var isValid = errors.length === 0;
    var score;
    if (isValid) {
      score = length >= 200 ? 70 : 50;
    } else {
      var base = 30 - errors.length * 10;
      score = base < 0 ? 0 : base;
    }

    return { is_valid: isValid, errors: errors, warnings: warnings, score: score };
  };

  LicenseValidator.prototype.validateLicense = function(license) {
    license = license || {};
    var metadata = license.metadata || {};
    var fullText = license.full_text == null ? "" : String(license.full_text);
    var clauses = license.clauses || [];
    var warrantyDisclaimer = license.warranty_disclaimer == null ? "" : String(license.warranty_disclaimer);

    var errors = [];
    var warnings = [];
    var i;

    var textErrors = this.validateStructure(fullText);
    for (i = 0; i < textErrors.length; i++) errors.push(textErrors[i]);

    var clauseErrors = this.validateClauses(clauses);
    for (i = 0; i < clauseErrors.length; i++) errors.push(clauseErrors[i]);

    if (metadata.spdx_id != null) {
      var spdxId = String(metadata.spdx_id);
      if (!this.validateSpdx(spdxId)) {
        errors.push(errorInvalidSpdx(spdxId));
      } else if (!this.validateSpdx(spdxId)) {
        warnings.push(warnNonStandardSpdx(spdxId));
        if (spdxHas(spdxId)) {
          if (!SPDX_DB[spdxId]) {
            warnings.push(warnMayNotBeOsiApproved());
          }
        }
      }
    }

    if (warrantyDisclaimer.trim() === "") {
      errors.push(errorMissingWarrantyDisclaimer());
    }

    var textLower = fullText.toLowerCase();
    if (!hasAnyKeyword(textLower, COMMON_COPYRIGHT_KEYWORDS)) {
      errors.push(errorMissingCopyrightNotice());
    }

    var templateErrors = this.validateTemplateVariables(fullText);
    for (i = 0; i < templateErrors.length; i++) errors.push(templateErrors[i]);

    if (!hasAnyKeyword(textLower, COMMON_WARRANTY_KEYWORDS) && warrantyDisclaimer.trim() === "") {
      warnings.push(warnMissingRecommended("Warranty disclaimer"));
    }

    var clauseNames = [];
    var hasPermission = false;
    var hasCondition = false;
    for (i = 0; i < clauses.length; i++) {
      var c = clauses[i];
      clauseNames.push(c.name);
      var cat = normalizedClauseCategory(c);
      if (cat === "permission") hasPermission = true;
      if (cat === "condition") hasCondition = true;
    }

    if (!hasPermission) {
      warnings.push(warnMissingRecommended("Permission grant"));
    }
    if (!hasCondition) {
      warnings.push(warnMissingRecommended("Condition clause"));
    }

    this.checkPotentialConflicts(clauseNames, warnings);

    if (clauses.length >= 2) {
      var priorities = [];
      for (i = 0; i < clauses.length; i++) priorities.push(clauses[i].priority);
      var sorted = priorities.slice(0);
      sorted.sort(function (a, b) { return a - b; });
      var inOrder = true;
      for (i = 0; i < priorities.length; i++) {
        if (priorities[i] !== sorted[i]) {
          inOrder = false;
          break;
        }
      }
      if (!inOrder) {
        warnings.push(warnUnusualOrdering());
      }
    }

    var score = this.checkCompleteness(license);
    var isValid = errors.length === 0;

    return { is_valid: isValid, errors: errors, warnings: warnings, score: score };
  };

  var defaultValidator = new LicenseValidator();

  NS.Validate = {
    validateLicense: function (license) { return defaultValidator.validateLicense(license); },
    validateText: function (text) { return defaultValidator.validateText(text); },
    validateSpdx: function (spdxId) { return defaultValidator.validateSpdx(spdxId); },
    validateClauses: function (clauses) { return defaultValidator.validateClauses(clauses); },
    validateStructure: function (text) { return defaultValidator.validateStructure(text); },
    checkCompleteness: function (license) { return defaultValidator.checkCompleteness(license); },
    validateTemplateVariables: function (text) { return defaultValidator.validateTemplateVariables(text); },
    LicenseValidator: LicenseValidator
  };
})();

// ---- engine-export.js ----
// Ported from src/export.rs + src/license.rs (GLG Rust -> JS)
(function () {
  if (typeof window !== 'undefined') window.GLGEngine = window.GLGEngine || {};
  var ROOT = (typeof window !== 'undefined') ? window : (typeof self !== 'undefined' ? self : globalThis);
  ROOT.GLGEngine = ROOT.GLGEngine || {};
  var NS = ROOT.GLGEngine;

  // ── Small helpers (ES5) ────────────────────────────────────────────────────

  function rep(s, n) {
    var r = '';
    for (var i = 0; i < n; i++) r += s;
    return r;
  }

  function pad2(n) {
    return (n < 10 ? '0' : '') + n;
  }

  function pad4(n) {
    var s = '' + n;
    while (s.length < 4) s = '0' + s;
    return s;
  }

  // Rust String::len() is byte length (UTF-8).
  function utf8Len(s) {
    if (!s) return 0;
    var n = 0;
    for (var i = 0; i < s.length; i++) {
      var c = s.charCodeAt(i);
      if (c < 0x80) n += 1;
      else if (c < 0x800) n += 2;
      else if (c >= 0xD800 && c <= 0xDBFF) { n += 4; i++; }
      else n += 3;
    }
    return n;
  }

  function isSome(v) {
    return v !== null && v !== undefined;
  }

  function isBlank(v) {
    return v === null || v === undefined || v === '';
  }

  function parseDate(s) {
    var d = new Date(s);
    return isNaN(d.getTime()) ? null : d;
  }

  // chrono `%Y-%m-%d %H:%M:%S UTC`
  function fmtDateTime(s) {
    var d = parseDate(s);
    if (!d) return String(s);
    return pad4(d.getUTCFullYear()) + '-' + pad2(d.getUTCMonth() + 1) + '-' + pad2(d.getUTCDate()) +
      ' ' + pad2(d.getUTCHours()) + ':' + pad2(d.getUTCMinutes()) + ':' + pad2(d.getUTCSeconds()) + ' UTC';
  }

  // chrono `%Y-%m-%dT%H:%M:%SZ`
  function fmtIsoZ(s) {
    var d = parseDate(s);
    if (!d) return String(s);
    return pad4(d.getUTCFullYear()) + '-' + pad2(d.getUTCMonth() + 1) + '-' + pad2(d.getUTCDate()) +
      'T' + pad2(d.getUTCHours()) + ':' + pad2(d.getUTCMinutes()) + ':' + pad2(d.getUTCSeconds()) + 'Z';
  }

  // chrono DateTime<Utc>::to_rfc3339() -> "+00:00" offset form, subseconds kept when present
  function fmtRfc3339(s) {
    var d = parseDate(s);
    if (!d) return String(s);
    var frac = '';
    var m = /\.(\d+)/.exec(String(s));
    if (m) {
      var digits = m[1].replace(/0+$/, '');
      if (digits.length) frac = '.' + digits;
    }
    return pad4(d.getUTCFullYear()) + '-' + pad2(d.getUTCMonth() + 1) + '-' + pad2(d.getUTCDate()) +
      'T' + pad2(d.getUTCHours()) + ':' + pad2(d.getUTCMinutes()) + ':' + pad2(d.getUTCSeconds()) +
      frac + '+00:00';
  }

  // chrono `%Y`
  function fmtYear(s) {
    var d = parseDate(s);
    if (!d) return String(s).slice(0, 4);
    return '' + d.getUTCFullYear();
  }

  // escape_xml from src/export.rs
  function escXml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  // escape_html from src/license.rs
  function escHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // escape_yaml / escape_toml from src/license.rs (replacement ORDER matters)
  function escYamlToml(s) {
    return String(s)
      .replace(/"/g, '\\"')
      .replace(/\\/g, '\\\\')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t');
  }

  // Debug {:?} for a clause category stored via serde snake_case ("permission" -> "Permission")
  function catDebug(cat) {
    if (!cat) return '';
    return cat.charAt(0).toUpperCase() + cat.slice(1);
  }

  // serde snake_case of a clause category ("Permission" -> "permission")
  function catSnake(cat) {
    if (!cat) return '';
    if (cat.charAt(0) === cat.charAt(0).toUpperCase() && cat.charAt(0) !== cat.charAt(0).toLowerCase()) {
      return cat.toLowerCase();
    }
    return cat;
  }

  function sortedClauses(license) {
    var arr = (license.clauses || []).slice();
    arr.sort(function (a, b) { return a.priority - b.priority; });
    return arr;
  }

  // author_line from src/export.rs
  function authorLine(license) {
    var parts = [];
    var authors = license.metadata.authors || [];
    for (var i = 0; i < authors.length; i++) {
      var a = authors[i];
      var line = a.name;
      if (isSome(a.organization)) line += ' (' + a.organization + ')';
      if (isSome(a.email)) line += ' <' + a.email + '>';
      parts.push(line);
    }
    return parts.join(', ');
  }

  // spdx_license_id from src/export.rs
  function spdxLicenseId(license) {
    if (isSome(license.metadata.spdx_id)) return license.metadata.spdx_id;
    if (isSome(license.metadata.id.spdx_identifier)) return license.metadata.id.spdx_identifier;
    return 'LicenseRef-' + license.metadata.id.uuid;
  }

  // License::to_spdx (src/license.rs lines ~154-204) — exact
  function toSpdxHeader(license) {
    var spdx = '';
    var id;
    if (isSome(license.metadata.spdx_id)) {
      id = license.metadata.spdx_id;
    } else if (isSome(license.metadata.id.spdx_identifier)) {
      id = license.metadata.id.spdx_identifier;
    } else {
      id = 'LicenseRef-' + license.metadata.id.uuid;
    }
    spdx += 'SPDX-License-Identifier: ' + id + '\n';
    spdx += 'SPDX-FileCopyrightText: ';
    var authors = license.metadata.authors || [];
    for (var i = 0; i < authors.length; i++) {
      if (i > 0) spdx += ', ';
      spdx += authors[i].name;
      if (isSome(authors[i].organization)) spdx += ' (' + authors[i].organization + ')';
    }
    spdx += '\n';
    spdx += 'SPDX-Version: SPDX-3.0\n';
    spdx += 'SPDX-DataLicense: CC0-1.0\n';
    if (isSome(license.metadata.id.spdx_identifier)) {
      spdx += 'SPDX-LicenseID: ' + license.metadata.id.spdx_identifier + '\n';
    }
    spdx += 'SPDX-Comment: ' + license.metadata.description + '\n';
    if (license.conditions && license.conditions.length) {
      spdx += '# Conditions:\n';
      for (var c1 = 0; c1 < license.conditions.length; c1++) {
        spdx += '#   - ' + license.conditions[c1] + '\n';
      }
    }
    if (license.permissions && license.permissions.length) {
      spdx += '# Permissions:\n';
      for (var p1 = 0; p1 < license.permissions.length; p1++) {
        spdx += '#   - ' + license.permissions[p1] + '\n';
      }
    }
    if (license.restrictions && license.restrictions.length) {
      spdx += '# Restrictions:\n';
      for (var r1 = 0; r1 < license.restrictions.length; r1++) {
        spdx += '#   - ' + license.restrictions[r1] + '\n';
      }
    }
    return spdx;
  }

  // category counts keyed by Debug name, ordered by first appearance (HashMap -> insertion order here)
  function categoryCounts(clauses) {
    var order = [];
    var counts = {};
    clauses = clauses || [];
    for (var i = 0; i < clauses.length; i++) {
      var key = catDebug(clauses[i].category);
      if (!counts[key]) { counts[key] = 0; order.push(key); }
      counts[key] += 1;
    }
    return { order: order, counts: counts };
  }

  // ── Plain Text ─────────────────────────────────────────────────────────────

  function exportToText(license) {
    var m = license.metadata;
    var text = '';

    text += rep('=', 60) + '\n';
    text += m.name + '\n';
    text += rep('=', 60) + '\n';
    text += '\n';

    text += 'Version:      ' + m.version + '\n';
    text += 'Category:     ' + m.category + '\n';
    text += 'Created:      ' + fmtDateTime(m.created_at) + '\n';
    text += 'Modified:     ' + fmtDateTime(m.modified_at) + '\n';
    text += 'UUID:         ' + m.id.uuid + '\n';
    text += 'Fingerprint:  ' + m.id.fingerprint + '\n';
    if (isSome(m.spdx_id)) text += 'SPDX ID:      ' + m.spdx_id + '\n';
    if (m.authors && m.authors.length) text += 'Authors:      ' + authorLine(license) + '\n';
    if (m.tags && m.tags.length) text += 'Tags:         ' + m.tags.join(', ') + '\n';

    text += '\n';
    text += rep('-', 60) + '\n';
    text += '\n';

    if (license.preamble) {
      text += 'PREAMBLE\n';
      text += rep('-', 40) + '\n\n';
      text += license.preamble + '\n\n';
    }

    var clauses = sortedClauses(license);
    for (var i = 0; i < clauses.length; i++) {
      var c = clauses[i];
      text += c.name.toUpperCase() + ' (Section ' + c.priority + ')\n';
      text += rep('-', utf8Len(c.name) + 20) + '\n';
      text += c.content + '\n\n';
    }

    if (license.permissions && license.permissions.length) {
      text += 'PERMISSIONS\n';
      text += rep('-', 40) + '\n';
      for (var pi = 0; pi < license.permissions.length; pi++) {
        text += '  * ' + license.permissions[pi] + '\n';
      }
      text += '\n';
    }

    if (license.conditions && license.conditions.length) {
      text += 'CONDITIONS\n';
      text += rep('-', 40) + '\n';
      for (var ci = 0; ci < license.conditions.length; ci++) {
        text += '  * ' + license.conditions[ci] + '\n';
      }
      text += '\n';
    }

    if (license.restrictions && license.restrictions.length) {
      text += 'RESTRICTIONS\n';
      text += rep('-', 40) + '\n';
      for (var ri = 0; ri < license.restrictions.length; ri++) {
        text += '  * ' + license.restrictions[ri] + '\n';
      }
      text += '\n';
    }

    if (isSome(license.patent_grant)) {
      text += 'PATENT GRANT\n';
      text += rep('-', 40) + '\n';
      text += license.patent_grant + '\n\n';
    }

    if (license.warranty_disclaimer) {
      text += 'WARRANTY DISCLAIMER\n';
      text += rep('-', 40) + '\n';
      text += license.warranty_disclaimer + '\n\n';
    }

    text += rep('-', 60) + '\n';
    text += 'Blake3:    ' + license.hash.blake3 + '\n';
    text += 'SHA-256:   ' + license.hash.sha256 + '\n';
    text += 'SHA3-256:  ' + license.hash.sha3_256 + '\n';
    text += rep('-', 60) + '\n';

    return text;
  }

  // ── Markdown ───────────────────────────────────────────────────────────────

  function exportToMarkdown(license) {
    var m = license.metadata;
    var md = '';

    md += '# ' + m.name + '\n\n';
    md += '**Version:** `' + m.version + '` &nbsp;&nbsp; **Category:** `' + m.category + '`\n\n';

    if (m.authors && m.authors.length) {
      md += '**Authors:** ';
      var names = [];
      for (var i = 0; i < m.authors.length; i++) {
        var a = m.authors[i];
        names.push(a.name + (isSome(a.email) ? ' <' + a.email + '>' : ''));
      }
      md += names.join(', ');
      md += '\n\n';
    }

    md += '**Created:** `' + fmtDateTime(m.created_at) + '` &nbsp;&nbsp; **Modified:** `' + fmtDateTime(m.modified_at) + '`\n\n';
    md += '**UUID:** `' + m.id.uuid + '`\n\n';
    md += '**Fingerprint:** `' + m.id.fingerprint + '`\n\n';

    if (isSome(m.spdx_id)) md += '**SPDX ID:** `' + m.spdx_id + '`\n\n';

    if (m.tags && m.tags.length) {
      var tagParts = [];
      for (var t = 0; t < m.tags.length; t++) tagParts.push('`' + m.tags[t] + '`');
      md += '**Tags:** ' + tagParts.join(', ') + '\n\n';
    }

    md += '---\n\n';

    if (license.preamble) {
      md += '## Preamble\n\n';
      md += license.preamble + '\n\n';
    }

    var clauses = sortedClauses(license);
    if (clauses.length) {
      md += '## Clauses\n\n';
      for (var ci = 0; ci < clauses.length; ci++) {
        md += '### ' + clauses[ci].name + ' `(' + catDebug(clauses[ci].category) + ')`\n\n';
        md += clauses[ci].content + '\n\n';
      }
    }

    if (license.permissions && license.permissions.length) {
      md += '## Permissions\n\n';
      for (var p1 = 0; p1 < license.permissions.length; p1++) {
        md += '- ' + license.permissions[p1] + '\n';
      }
      md += '\n';
    }

    if (license.conditions && license.conditions.length) {
      md += '## Conditions\n\n';
      for (var c1 = 0; c1 < license.conditions.length; c1++) {
        md += '- ' + license.conditions[c1] + '\n';
      }
      md += '\n';
    }

    if (license.restrictions && license.restrictions.length) {
      md += '## Restrictions\n\n';
      for (var r1 = 0; r1 < license.restrictions.length; r1++) {
        md += '- ' + license.restrictions[r1] + '\n';
      }
      md += '\n';
    }

    if (isSome(license.patent_grant)) {
      md += '## Patent Grant\n\n';
      md += license.patent_grant + '\n\n';
    }

    if (license.warranty_disclaimer) {
      md += '## Warranty Disclaimer\n\n';
      md += license.warranty_disclaimer + '\n\n';
    }

    md += '---\n\n';
    md += '### Hashes\n\n';
    md += '| Algorithm | Hash |\n';
    md += '|-----------|------|\n';
    md += '| Blake3 | `' + license.hash.blake3 + '` |\n';
    md += '| SHA-256 | `' + license.hash.sha256 + '` |\n';
    md += '| SHA3-256 | `' + license.hash.sha3_256 + '` |\n';

    return md;
  }

  // ── Mini markdown -> HTML renderer (pulldown-cmark subset) ────────────────

  var KNOWN_ENTITIES = {
    amp: '&', lt: '<', gt: '>', quot: '"', apos: "'",
    nbsp: '\u00A0', copy: '\u00A9', reg: '\u00AE', trade: '\u2122',
    hellip: '\u2026', ndash: '\u2013', mdash: '\u2014',
    lsquo: '\u2018', rsquo: '\u2019', ldquo: '\u201C', rdquo: '\u201D',
    laquo: '\u00AB', raquo: '\u00BB', deg: '\u00B0', plusmn: '\u00B1',
    cent: '\u00A2', pound: '\u00A3', yen: '\u00A5', euro: '\u20AC',
    sect: '\u00A7', para: '\u00B6', middot: '\u00B7', bull: '\u2022',
    dagger: '\u2020', Dagger: '\u2021', permil: '\u2030',
    lsaquo: '\u2039', rsaquo: '\u203A', times: '\u00D7', divide: '\u00F7',
    minus: '\u2212', frac12: '\u00BD', frac14: '\u00BC', frac34: '\u00BE',
    sup2: '\u00B2', sup3: '\u00B3', micro: '\u00B5', shy: '\u00AD',
    nbsp2: '\u00A0'
  };

  var ENTITY_RE = /^&(#\d+|#x[0-9a-fA-F]+|[A-Za-z][A-Za-z0-9]*);/;

  function decodeEntity(src) {
    var m = ENTITY_RE.exec(src);
    if (!m) return null;
    var body = m[0].slice(1, -1);
    if (body.charAt(0) === '#') {
      if (body.charAt(1) === 'x' || body.charAt(1) === 'X') {
        return String.fromCharCode(parseInt(body.slice(2), 16));
      }
      return String.fromCharCode(parseInt(body.slice(1), 10));
    }
    if (KNOWN_ENTITIES[body]) return KNOWN_ENTITIES[body];
    return null; // unknown entity -> literal text (will be escaped)
  }

  function escTextBuf(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  var AUTOLINK_RE = /^<([A-Za-z][A-Za-z0-9+.\-]{1,31}:[^<>\s]*)>/;
  var HTML_TAG_RE = /^<\/?[A-Za-z][A-Za-z0-9-]*(?:\s[^<>]*)?\/?>/;

  function flushText(buf, out) {
    if (buf.length) out.push(escTextBuf(buf.join('')));
    buf.length = 0;
  }

  function renderInlines(src) {
    var out = [];
    var buf = [];
    var i = 0;
    while (i < src.length) {
      var ch = src.charAt(i);

      if (ch === '`') {
        var j = src.indexOf('`', i + 1);
        if (j !== -1) {
          flushText(buf, out);
          out.push('<code>' + escTextBuf(src.slice(i + 1, j)) + '</code>');
          i = j + 1;
          continue;
        }
        buf.push(ch);
        i++;
        continue;
      }

      if (ch === '*' && src.charAt(i + 1) === '*') {
        var close2 = src.indexOf('**', i + 2);
        if (close2 !== -1) {
          flushText(buf, out);
          out.push('<strong>' + renderInlines(src.slice(i + 2, close2)) + '</strong>');
          i = close2 + 2;
          continue;
        }
      }
      if (src.slice(i, i + 2) === '~~') {
        var closeS = src.indexOf('~~', i + 2);
        if (closeS !== -1) {
          flushText(buf, out);
          out.push('<del>' + renderInlines(src.slice(i + 2, closeS)) + '</del>');
          i = closeS + 2;
          continue;
        }
      }
      if (ch === '*') {
        var closeE = src.indexOf('*', i + 1);
        if (closeE !== -1) {
          flushText(buf, out);
          out.push('<em>' + renderInlines(src.slice(i + 1, closeE)) + '</em>');
          i = closeE + 1;
          continue;
        }
      }

      if (ch === '&') {
        var decoded = decodeEntity(src.slice(i));
        if (decoded !== null) {
          buf.push(decoded);
          i += ENTITY_RE.exec(src.slice(i))[0].length;
          continue;
        }
        buf.push(ch);
        i++;
        continue;
      }

      if (ch === '<') {
        var auto = AUTOLINK_RE.exec(src.slice(i));
        if (auto) {
          flushText(buf, out);
          var target = auto[1];
          out.push('<a href="' + escTextBuf(target) + '">' + escTextBuf(target) + '</a>');
          i += auto[0].length;
          continue;
        }
        var tag = HTML_TAG_RE.exec(src.slice(i));
        if (tag) {
          flushText(buf, out);
          out.push(tag[0]);
          i += tag[0].length;
          continue;
        }
        var comment = /^<!--[\s\S]*?-->/.exec(src.slice(i));
        if (comment) {
          flushText(buf, out);
          out.push(comment[0]);
          i += comment[0].length;
          continue;
        }
        buf.push(ch);
        i++;
        continue;
      }

      if (ch === '\\' && i + 1 < src.length) {
        buf.push(src.charAt(i + 1));
        i += 2;
        continue;
      }

      buf.push(ch);
      i++;
    }
    flushText(buf, out);
    return out.join('');
  }

  function isThematicBreak(line) {
    return /^ {0,3}(?:(?:- *){3,}|(?:\* *){3,}|(?:_ *){3,})$/.test(line);
  }

  function atxHeading(line) {
    var m = /^ {0,3}(#{1,6})(?:[ \t]+(.*?))?[ \t]*(?:#+)?[ \t]*$/.exec(line);
    if (!m) return null;
    return { level: m[1].length, text: m[2] || '' };
  }

  function isListItem(line) {
    return /^ {0,3}[-*+][ \t]+/.test(line);
  }

  // render_markdown_to_html from src/export.rs (STRIKETHROUGH enabled)
  function renderMarkdownToHtml(md) {
    var lines = md.split('\n');
    var out = '';
    var i = 0;
    while (i < lines.length) {
      var line = lines[i];
      if (line === '' || /^[ \t]*$/.test(line)) { i++; continue; }

      if (isThematicBreak(line)) {
        out += '<hr />\n';
        i++;
        continue;
      }

      var h = atxHeading(line);
      if (h) {
        out += '<h' + h.level + '>' + renderInlines(h.text) + '</h' + h.level + '>\n';
        i++;
        continue;
      }

      if (isListItem(line)) {
        var items = [];
        while (i < lines.length && isListItem(lines[i])) {
          var itemLine = lines[i];
          itemLine = itemLine.replace(/^ {0,3}[-*+][ \t]+/, '');
          items.push(itemLine);
          i++;
        }
        out += '<ul>\n';
        for (var k = 0; k < items.length; k++) {
          out += '<li>' + renderInlines(items[k]) + '</li>\n';
        }
        out += '</ul>\n';
        continue;
      }

      var para = [];
      while (i < lines.length && lines[i] !== '' &&
             /^[ \t]*$/.test(lines[i]) !== true &&
             !isThematicBreak(lines[i]) &&
             !atxHeading(lines[i]) &&
             !isListItem(lines[i])) {
        para.push(lines[i]);
        i++;
      }
      out += '<p>';
      for (var j = 0; j < para.length; j++) {
        if (j > 0) out += '\n';
        out += renderInlines(para[j]);
      }
      out += '</p>\n';
    }
    return out;
  }

  // ── HTML ───────────────────────────────────────────────────────────────────

  function exportToHtml(license) {
    var md = exportToMarkdown(license);
    var bodyHtml = renderMarkdownToHtml(md);

    var html = '';
    html += '<!DOCTYPE html>\n<html lang="en">\n<head>\n';
    html += '  <meta charset="UTF-8">\n';
    html += '  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n';
    html += '  <title>' + escXml(license.metadata.name) + '</title>\n';
    html += '  <style>\n';
    html += '    :root { --bg: #ffffff; --fg: #1a1a1a; --accent: #2563eb; --border: #e5e7eb; --code-bg: #f3f4f6; }\n';
    html += '    @media (prefers-color-scheme: dark) {\n';
    html += '      :root { --bg: #1a1a2e; --fg: #e0e0e0; --accent: #60a5fa; --border: #374151; --code-bg: #1f2937; }\n';
    html += '    }\n';
    html += '    * { box-sizing: border-box; margin: 0; padding: 0; }\n';
    html += "    body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; background: var(--bg); color: var(--fg); line-height: 1.7; padding: 2rem; max-width: 900px; margin: 0 auto; }\n";
    html += '    h1 { font-size: 2rem; border-bottom: 3px solid var(--accent); padding-bottom: 0.5rem; margin-bottom: 1.5rem; }\n';
    html += '    h2 { font-size: 1.4rem; margin-top: 2rem; margin-bottom: 0.8rem; color: var(--accent); }\n';
    html += '    h3 { font-size: 1.1rem; margin-top: 1.2rem; margin-bottom: 0.5rem; }\n';
    html += '    p { margin-bottom: 1rem; }\n';
    html += '    ul, ol { margin-left: 1.5rem; margin-bottom: 1rem; }\n';
    html += '    li { margin-bottom: 0.3rem; }\n';
    html += '    code { background: var(--code-bg); padding: 0.15em 0.4em; border-radius: 4px; font-size: 0.9em; }\n';
    html += '    pre { background: var(--code-bg); padding: 1rem; border-radius: 8px; overflow-x: auto; margin-bottom: 1rem; }\n';
    html += '    pre code { background: none; padding: 0; }\n';
    html += '    table { border-collapse: collapse; width: 100%%; margin-bottom: 1rem; }\n';
    html += '    th, td { border: 1px solid var(--border); padding: 0.5rem 1rem; text-align: left; }\n';
    html += '    th { background: var(--code-bg); font-weight: 600; }\n';
    html += '    hr { border: none; border-top: 1px solid var(--border); margin: 2rem 0; }\n';
    html += '    strong { font-weight: 600; }\n';
    html += '    .meta-badge { display: inline-block; background: var(--code-bg); border: 1px solid var(--border); border-radius: 6px; padding: 0.25rem 0.75rem; margin: 0.25rem 0.25rem 0.25rem 0; font-size: 0.85rem; }\n';
    html += '    .hash-section { font-family: monospace; font-size: 0.85rem; }\n';
    html += '  </style>\n';
    html += '</head>\n<body>\n';
    html += bodyHtml;
    html += '\n</body>\n</html>';

    return html;
  }

  // ── JSON (serde_json::to_string_pretty, field order) ──────────────────────

  function toJsonLicense(license) {
    var m = license.metadata;
    var obj = {
      metadata: {
        id: {
          uuid: m.id.uuid,
          fingerprint: m.id.fingerprint,
          spdx_identifier: isSome(m.id.spdx_identifier) ? m.id.spdx_identifier : null
        },
        name: m.name,
        description: m.description,
        version: m.version,
        created_at: m.created_at,
        modified_at: m.modified_at,
        authors: (m.authors || []).map(function (a) {
          return {
            name: a.name,
            email: isSome(a.email) ? a.email : null,
            organization: isSome(a.organization) ? a.organization : null,
            url: isSome(a.url) ? a.url : null
          };
        }),
        tags: (m.tags || []).slice(),
        category: m.category,
        spdx_id: isSome(m.spdx_id) ? m.spdx_id : null,
        custom_id: isSome(m.custom_id) ? m.custom_id : null
      },
      preamble: license.preamble,
      clauses: (license.clauses || []).map(function (c) {
        return {
          clause_uuid: c.clause_uuid,
          name: c.name,
          content: c.content,
          category: catSnake(c.category),
          priority: c.priority
        };
      }),
      conditions: (license.conditions || []).slice(),
      permissions: (license.permissions || []).slice(),
      restrictions: (license.restrictions || []).slice(),
      patent_grant: isSome(license.patent_grant) ? license.patent_grant : null,
      warranty_disclaimer: license.warranty_disclaimer,
      full_text: license.full_text,
      hash: {
        blake3: license.hash.blake3,
        sha256: license.hash.sha256,
        sha3_256: license.hash.sha3_256
      }
    };
    return obj;
  }

  function exportToJson(license) {
    return JSON.stringify(toJsonLicense(license), null, 2);
  }

  // ── YAML (serde_yaml style, structure/key order) ──────────────────────────

  function yamlNeedsQuote(s) {
    if (/^[ \t]/.test(s) || /[ \t]$/.test(s)) return true;
    if (/[\n\r\t]/.test(s)) return true;
    if (s.indexOf(': ') !== -1) return true;
    if (s.indexOf(' #') !== -1) return true;
    if (/^[-?:,[\]{}#&*!|>'"%@`]/.test(s)) return true;
    if (/^[^A-Za-z0-9_\-\[\]{},.:/\s]/.test(s)) return true;
    if (/^-?(0|[1-9][0-9]*|[1-9][0-9_]*|0[0-7]+|0x[0-9a-fA-F]+|0b[01]+)$/.test(s)) return true;
    if (/^-?((0|[1-9][0-9]*)(\.[0-9]*)?|\.[0-9]+)([eE][-+]?[0-9]+)?$/.test(s)) {
      if (s === '1.0' || /[-+]?\.[0-9]+$/.test(s)) return true;
      if (/^[-]?[0-9]+(\.[0-9]+)?([eE][-+]?[0-9]+)?$/.test(s)) {
        if (s.indexOf('.') === -1 || /[eE]/.test(s)) return true;
        return false;
      }
      return false;
    }
    if (/^(true|false|yes|no|on|off|null|~)$/i.test(s)) return true;
    if (/^\.[0-9]+$/.test(s)) return true;
    return false;
  }

  function yamlQuote(s) {
    var escaped = String(s)
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t');
    escaped = escaped.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g, function (m) {
      var h = m.charCodeAt(0).toString(16).toUpperCase();
      return '\\u00' + (h.length < 2 ? '0' + h : h);
    });
    return '"' + escaped + '"';
  }

  function yamlScalar(v) {
    if (v === null || v === undefined) return 'null';
    if (typeof v === 'boolean') return v ? 'true' : 'false';
    if (typeof v === 'number') {
      if (!isFinite(v)) return '"' + v + '"';
      return String(v);
    }
    var s = String(v);
    if (s === '') return '""';
    if (yamlNeedsQuote(s)) return yamlQuote(s);
    return s;
  }

  function isArray(v) {
    return Object.prototype.toString.call(v) === '[object Array]';
  }

  function isMap(v) {
    return typeof v === 'object' && v !== null && !isArray(v);
  }

  function yamlEntry(key, val, indent) {
    var pad = rep(' ', indent);
    if (isArray(val)) {
      if (val.length === 0) return pad + key + ': []\n';
      if (isMap(val[0])) {
        var s = pad + key + ':\n';
        for (var j = 0; j < val.length; j++) {
          s += yamlMapBody(val[j], indent + 4, pad + '  - ');
        }
        return s;
      }
      var s2 = pad + key + ':\n';
      for (var k = 0; k < val.length; k++) {
        s2 += pad + '  - ' + yamlScalar(val[k]) + '\n';
      }
      return s2;
    }
    if (isMap(val)) {
      var keys = Object.keys(val);
      if (keys.length === 0) return pad + key + ': {}\n';
      return pad + key + ':\n' + yamlMap(val, indent + 2);
    }
    return pad + key + ': ' + yamlScalar(val) + '\n';
  }

  function yamlMapBody(map, keyIndent, firstPrefix) {
    var keys = Object.keys(map);
    var s = '';
    for (var i = 0; i < keys.length; i++) {
      var e = yamlEntry(keys[i], map[keys[i]], keyIndent);
      if (i === 0) {
        var prefix = rep(' ', keyIndent);
        if (e.indexOf(prefix) === 0) {
          e = firstPrefix + e.slice(prefix.length);
        }
      }
      s += e;
    }
    return s;
  }

  function yamlMap(map, indent) {
    var keys = Object.keys(map);
    var s = '';
    for (var i = 0; i < keys.length; i++) {
      s += yamlEntry(keys[i], map[keys[i]], indent);
    }
    return s;
  }

  function toYamlLicense(license) {
    var m = license.metadata;
    return {
      metadata: {
        id: {
          uuid: m.id.uuid,
          fingerprint: m.id.fingerprint,
          spdx_identifier: isSome(m.id.spdx_identifier) ? m.id.spdx_identifier : null
        },
        name: m.name,
        description: m.description,
        version: m.version,
        created_at: m.created_at,
        modified_at: m.modified_at,
        authors: (m.authors || []).map(function (a) {
          return {
            name: a.name,
            email: isSome(a.email) ? a.email : null,
            organization: isSome(a.organization) ? a.organization : null,
            url: isSome(a.url) ? a.url : null
          };
        }),
        tags: (m.tags || []).slice(),
        category: m.category,
        spdx_id: isSome(m.spdx_id) ? m.spdx_id : null,
        custom_id: isSome(m.custom_id) ? m.custom_id : null
      },
      preamble: license.preamble,
      clauses: (license.clauses || []).map(function (c) {
        return {
          clause_uuid: c.clause_uuid,
          name: c.name,
          content: c.content,
          category: catSnake(c.category),
          priority: c.priority
        };
      }),
      conditions: (license.conditions || []).slice(),
      permissions: (license.permissions || []).slice(),
      restrictions: (license.restrictions || []).slice(),
      patent_grant: isSome(license.patent_grant) ? license.patent_grant : null,
      warranty_disclaimer: license.warranty_disclaimer,
      full_text: license.full_text,
      hash: {
        blake3: license.hash.blake3,
        sha256: license.hash.sha256,
        sha3_256: license.hash.sha3_256
      }
    };
  }

  function exportToYaml(license) {
    return yamlMap(toYamlLicense(license), 0);
  }

  // ── TOML (toml crate style, values before tables) ─────────────────────────

  function tomlStr(s) {
    return yamlQuote(s);
  }

  function tomlArr(arr) {
    arr = arr || [];
    var parts = [];
    for (var i = 0; i < arr.length; i++) parts.push(tomlStr(arr[i]));
    return '[' + parts.join(', ') + ']';
  }

  function exportToToml(license) {
    var m = license.metadata;
    var out = '';

    out += 'preamble = ' + tomlStr(license.preamble) + '\n';
    out += 'conditions = ' + tomlArr(license.conditions) + '\n';
    out += 'permissions = ' + tomlArr(license.permissions) + '\n';
    out += 'restrictions = ' + tomlArr(license.restrictions) + '\n';
    if (isSome(license.patent_grant)) out += 'patent_grant = ' + tomlStr(license.patent_grant) + '\n';
    out += 'warranty_disclaimer = ' + tomlStr(license.warranty_disclaimer) + '\n';
    out += 'full_text = ' + tomlStr(license.full_text) + '\n';

    out += '\n[metadata]\n';
    out += 'name = ' + tomlStr(m.name) + '\n';
    out += 'description = ' + tomlStr(m.description) + '\n';
    out += 'version = ' + tomlStr(m.version) + '\n';
    out += 'created_at = "' + m.created_at + '"\n';
    out += 'modified_at = "' + m.modified_at + '"\n';
    out += 'tags = ' + tomlArr(m.tags) + '\n';
    out += 'category = ' + tomlStr(m.category) + '\n';
    if (isSome(m.spdx_id)) out += 'spdx_id = ' + tomlStr(m.spdx_id) + '\n';
    if (isSome(m.custom_id)) out += 'custom_id = ' + tomlStr(m.custom_id) + '\n';

    out += '\n[metadata.id]\n';
    out += 'uuid = "' + m.id.uuid + '"\n';
    out += 'fingerprint = ' + tomlStr(m.id.fingerprint) + '\n';
    if (isSome(m.id.spdx_identifier)) out += 'spdx_identifier = ' + tomlStr(m.id.spdx_identifier) + '\n';

    var authors = m.authors || [];
    for (var a = 0; a < authors.length; a++) {
      out += '\n[[metadata.authors]]\n';
      out += 'name = ' + tomlStr(authors[a].name) + '\n';
      if (isSome(authors[a].email)) out += 'email = ' + tomlStr(authors[a].email) + '\n';
      if (isSome(authors[a].organization)) out += 'organization = ' + tomlStr(authors[a].organization) + '\n';
      if (isSome(authors[a].url)) out += 'url = ' + tomlStr(authors[a].url) + '\n';
    }

    var clauses = sortedClauses(license);
    for (var c = 0; c < clauses.length; c++) {
      out += '\n[[clauses]]\n';
      out += 'clause_uuid = "' + clauses[c].clause_uuid + '"\n';
      out += 'name = ' + tomlStr(clauses[c].name) + '\n';
      out += 'content = ' + tomlStr(clauses[c].content) + '\n';
      out += 'category = ' + tomlStr(catSnake(clauses[c].category)) + '\n';
      out += 'priority = ' + clauses[c].priority + '\n';
    }

    out += '\n[hash]\n';
    out += 'blake3 = ' + tomlStr(license.hash.blake3) + '\n';
    out += 'sha256 = ' + tomlStr(license.hash.sha256) + '\n';
    out += 'sha3_256 = ' + tomlStr(license.hash.sha3_256) + '\n';

    return out;
  }

  // ── XML ────────────────────────────────────────────────────────────────────

  function xmlIndent(depth) {
    return rep('  ', depth);
  }

  function exportToXml(license) {
    var m = license.metadata;
    var xml = '';
    xml += '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<license>\n';

    var d = 1;
    xml += xmlIndent(d) + '<metadata>\n';
    xml += xmlIndent(d + 1) + '<name>' + escXml(m.name) + '</name>\n';
    xml += xmlIndent(d + 1) + '<version>' + escXml(m.version) + '</version>\n';
    xml += xmlIndent(d + 1) + '<description>' + escXml(m.description) + '</description>\n';
    xml += xmlIndent(d + 1) + '<category>' + m.category + '</category>\n';
    xml += xmlIndent(d + 1) + '<created_at>' + fmtRfc3339(m.created_at) + '</created_at>\n';
    xml += xmlIndent(d + 1) + '<modified_at>' + fmtRfc3339(m.modified_at) + '</modified_at>\n';
    xml += xmlIndent(d + 1) + '<uuid>' + m.id.uuid + '</uuid>\n';
    xml += xmlIndent(d + 1) + '<fingerprint>' + escXml(m.id.fingerprint) + '</fingerprint>\n';
    if (isSome(m.spdx_id)) {
      xml += xmlIndent(d + 1) + '<spdx_id>' + escXml(m.spdx_id) + '</spdx_id>\n';
    }
    if (isSome(m.custom_id)) {
      xml += xmlIndent(d + 1) + '<custom_id>' + escXml(m.custom_id) + '</custom_id>\n';
    }

    xml += xmlIndent(d + 1) + '<authors>\n';
    var authors = m.authors || [];
    for (var i = 0; i < authors.length; i++) {
      xml += xmlIndent(d + 2) + '<author>\n';
      xml += xmlIndent(d + 3) + '<name>' + escXml(authors[i].name) + '</name>\n';
      if (isSome(authors[i].email)) xml += xmlIndent(d + 3) + '<email>' + escXml(authors[i].email) + '</email>\n';
      if (isSome(authors[i].organization)) xml += xmlIndent(d + 3) + '<organization>' + escXml(authors[i].organization) + '</organization>\n';
      if (isSome(authors[i].url)) xml += xmlIndent(d + 3) + '<url>' + escXml(authors[i].url) + '</url>\n';
      xml += xmlIndent(d + 2) + '</author>\n';
    }
    xml += xmlIndent(d + 1) + '</authors>\n';

    if (m.tags && m.tags.length) {
      xml += xmlIndent(d + 1) + '<tags>\n';
      for (var t = 0; t < m.tags.length; t++) {
        xml += xmlIndent(d + 2) + '<tag>' + escXml(m.tags[t]) + '</tag>\n';
      }
      xml += xmlIndent(d + 1) + '</tags>\n';
    }

    xml += xmlIndent(d) + '</metadata>\n';

    if (license.preamble) {
      xml += xmlIndent(d) + '<preamble>' + escXml(license.preamble) + '</preamble>\n';
    }

    var clauses = sortedClauses(license);
    if (clauses.length) {
      xml += xmlIndent(d) + '<clauses>\n';
      for (var c = 0; c < clauses.length; c++) {
        xml += xmlIndent(d + 1) + '<clause>\n';
        xml += xmlIndent(d + 2) + '<name>' + escXml(clauses[c].name) + '</name>\n';
        xml += xmlIndent(d + 2) + '<uuid>' + clauses[c].clause_uuid + '</uuid>\n';
        xml += xmlIndent(d + 2) + '<category>' + catDebug(clauses[c].category) + '</category>\n';
        xml += xmlIndent(d + 2) + '<priority>' + clauses[c].priority + '</priority>\n';
        xml += xmlIndent(d + 2) + '<content>' + escXml(clauses[c].content) + '</content>\n';
        xml += xmlIndent(d + 1) + '</clause>\n';
      }
      xml += xmlIndent(d) + '</clauses>\n';
    }

    if (license.permissions && license.permissions.length) {
      xml += xmlIndent(d) + '<permissions>\n';
      for (var p = 0; p < license.permissions.length; p++) {
        xml += xmlIndent(d + 1) + '<permission>' + escXml(license.permissions[p]) + '</permission>\n';
      }
      xml += xmlIndent(d) + '</permissions>\n';
    }

    if (license.conditions && license.conditions.length) {
      xml += xmlIndent(d) + '<conditions>\n';
      for (var co = 0; co < license.conditions.length; co++) {
        xml += xmlIndent(d + 1) + '<condition>' + escXml(license.conditions[co]) + '</condition>\n';
      }
      xml += xmlIndent(d) + '</conditions>\n';
    }

    if (license.restrictions && license.restrictions.length) {
      xml += xmlIndent(d) + '<restrictions>\n';
      for (var r = 0; r < license.restrictions.length; r++) {
        xml += xmlIndent(d + 1) + '<restriction>' + escXml(license.restrictions[r]) + '</restriction>\n';
      }
      xml += xmlIndent(d) + '</restrictions>\n';
    }

    if (isSome(license.patent_grant)) {
      xml += xmlIndent(d) + '<patent_grant>' + escXml(license.patent_grant) + '</patent_grant>\n';
    }

    if (license.warranty_disclaimer) {
      xml += xmlIndent(d) + '<warranty_disclaimer>' + escXml(license.warranty_disclaimer) + '</warranty_disclaimer>\n';
    }

    xml += xmlIndent(d) + '<hashes>\n';
    xml += xmlIndent(d + 1) + '<blake3>' + escXml(license.hash.blake3) + '</blake3>\n';
    xml += xmlIndent(d + 1) + '<sha256>' + escXml(license.hash.sha256) + '</sha256>\n';
    xml += xmlIndent(d + 1) + '<sha3_256>' + escXml(license.hash.sha3_256) + '</sha3_256>\n';
    xml += xmlIndent(d) + '</hashes>\n';

    xml += '</license>\n';
    return xml;
  }

  // ── SPDX (JSON document from src/export.rs) ────────────────────────────────

  function spdxJsonDoc(license) {
    var spdx_id = spdxLicenseId(license);
    var author_text = authorLine(license);

    var spdx = '';
    spdx += '{\n';
    spdx += '  "spdxVersion": "SPDX-3.0",\n';
    spdx += '  "dataLicense": "CC0-1.0",\n';
    spdx += '  "SPDXID": "SPDXRef-DOCUMENT",\n';
    spdx += '  "name": "' + escXml(license.metadata.name) + '",\n';
    spdx += '  "documentNamespace": "https://glg-project.org/licenses/' + license.metadata.id.uuid + '",\n';
    spdx += '  "creationInfo": {\n    "created": "' + fmtIsoZ(license.metadata.created_at) + '",\n    "creators": ["Tool: glg-' + license.metadata.version + '"]\n  },\n';
    spdx += '  "externalDocumentRefs": [\n    {"referenceType": "SPDXReference-DOCUMENT", "referenceCategory": "SECURITY", "referenceLocator": "https://spdx.org/licenses/' + escXml(spdx_id) + '"}\n  ],\n';
    spdx += '  "packages": [\n';
    spdx += '    {\n';
    spdx += '      "name": "' + escXml(license.metadata.name) + '",\n';
    spdx += '      "SPDXID": "SPDXRef-Package",\n';
    spdx += '      "downloadLocation": "NOASSERTION",\n';
    spdx += '      "copyrightText": "' + escXml(author_text) + '",\n';
    spdx += '      "licenseConcluded": "' + escXml(spdx_id) + '",\n';
    spdx += '      "licenseDeclared": "' + escXml(spdx_id) + '",\n';
    spdx += '      "description": "' + escXml(license.metadata.description) + '",\n';
    spdx += '      "externalRefs": []\n';
    spdx += '    }\n';
    spdx += '  ],\n';

    spdx += '  "relationships": [\n';
    spdx += '    {\n';
    spdx += '      "spdxElementId": "SPDXRef-DOCUMENT",\n';
    spdx += '      "relationshipType": "DESCRIBES",\n';
    spdx += '      "relatedSpdxElement": "SPDXRef-Package"\n';
    spdx += '    }\n';
    spdx += '  ],\n';

    spdx += '  "annotations": [\n';
    spdx += '    {\n';
    spdx += '      "annotationDate": "' + fmtIsoZ(license.metadata.modified_at) + '",\n';
    spdx += '      "annotationType": "OTHER",\n';
    spdx += '      "spdxElementId": "SPDXRef-DOCUMENT",\n';
    spdx += '      "comment": "BLAKE3: ' + license.hash.blake3 + ' | SHA-256: ' + license.hash.sha256 + ' | SHA3-256: ' + license.hash.sha3_256 + '"\n';
    spdx += '    }\n';
    spdx += '  ],\n';

    spdx += '  "snippets": [\n';
    spdx += '    {\n';
    spdx += '      "name": "License-Summary",\n';
    spdx += '      "SPDXID": "SPDXRef-Snippet-Summary",\n';
    spdx += '      "copyrightText": "' + escXml(author_text) + '",\n';
    spdx += '      "licenseConcluded": "NOASSERTION",\n';
    spdx += '      "comment": "Category: ' + license.metadata.category + ' | Clauses: ' + (license.clauses || []).length +
      ' | Permissions: ' + (license.permissions || []).length +
      ' | Conditions: ' + (license.conditions || []).length +
      ' | Restrictions: ' + (license.restrictions || []).length + '"\n';
    spdx += '    }\n';
    spdx += '  ]\n';

    spdx += '}\n';
    return spdx;
  }

  // ── CycloneDX SBOM ─────────────────────────────────────────────────────────

  function exportCycloneDX(license) {
    return generateCycloneDxSbom(license);
  }

  function generateCycloneDxSbom(license) {
    var spdx_id = spdxLicenseId(license);
    var author_text = authorLine(license);

    var cdx = '';
    cdx += '{\n';
    cdx += '  "bomFormat": "CycloneDX",\n';
    cdx += '  "specVersion": "1.5",\n';
    cdx += '  "version": 1,\n';
    cdx += '  "metadata": {\n';
    cdx += '    "tools": [\n';
    cdx += '      {\n';
    cdx += '        "vendor": "glg-project",\n';
    cdx += '        "name": "glg",\n';
    cdx += '        "version": "' + escXml(license.metadata.version) + '"\n';
    cdx += '      }\n';
    cdx += '    ],\n';
    cdx += '    "licenses": [\n';
    cdx += '      {\n';
    cdx += '        "license": {\n';
    cdx += '          "id": "' + escXml(spdx_id) + '",\n';
    cdx += '          "name": "' + escXml(license.metadata.name) + '"\n';
    cdx += '        }\n';
    cdx += '      }\n';
    cdx += '    ],\n';
    cdx += '    "supplier": {\n      "name": "' + escXml(author_text) + '"\n    },\n';
    cdx += '    "timestamp": "' + fmtIsoZ(license.metadata.created_at) + '"\n';
    cdx += '  },\n';

    cdx += '  "components": [\n';
    cdx += '    {\n';
    cdx += '      "type": "library",\n';
    cdx += '      "name": "' + escXml(license.metadata.name) + '",\n';
    cdx += '      "version": "' + escXml(license.metadata.version) + '",\n';
    cdx += '      "licenses": [\n';
    cdx += '        {\n';
    cdx += '          "license": {\n';
    cdx += '            "id": "' + escXml(spdx_id) + '",\n';
    cdx += '            "name": "' + escXml(license.metadata.name) + '"\n';
    cdx += '          }\n';
    cdx += '        }\n';
    cdx += '      ],\n';
    cdx += '      "properties": [\n';

    cdx += '        { "name": "glg.category", "value": "' + license.metadata.category + '" },\n';
    cdx += '        { "name": "glg.clauses.count", "value": "' + (license.clauses || []).length + '" },\n';
    cdx += '        { "name": "glg.permissions.count", "value": "' + (license.permissions || []).length + '" },\n';
    cdx += '        { "name": "glg.conditions.count", "value": "' + (license.conditions || []).length + '" },\n';
    cdx += '        { "name": "glg.restrictions.count", "value": "' + (license.restrictions || []).length + '" },\n';
    cdx += '        { "name": "glg.hash.blake3", "value": "' + escXml(license.hash.blake3) + '" },\n';
    cdx += '        { "name": "glg.hash.sha256", "value": "' + escXml(license.hash.sha256) + '" },\n';
    cdx += '        { "name": "glg.hash.sha3_256", "value": "' + escXml(license.hash.sha3_256) + '" }\n';

    cdx += '      ]\n';
    cdx += '    }\n';
    cdx += '  ],\n';

    cdx += '  "externalReferences": [\n';
    cdx += '    {\n      "type": "license",\n      "url": "https://spdx.org/licenses/' + escXml(spdx_id) + '"\n    }\n';
    cdx += '  ],\n';

    cdx += '  "dependencies": []\n';
    cdx += '}\n';

    return cdx;
  }

  // ── Notice ─────────────────────────────────────────────────────────────────

  function exportNotice(license) {
    var notice = '';
    var year = fmtYear(license.metadata.created_at);
    var modified_year = fmtYear(license.metadata.modified_at);

    notice += license.metadata.name + ' ' + license.metadata.version + '  -  License Notice\n';
    notice += rep('=', 50) + '\n';
    notice += '\n';

    notice += 'Copyright (c) ';
    if (year === modified_year) {
      notice += year;
    } else {
      notice += year + '-' + modified_year;
    }
    notice += '  ';
    notice += authorLine(license);
    notice += '\n\n';

    notice += 'This software and associated documentation files (the "Software") are\n';
    notice += 'provided under the terms of the following license:\n\n';

    if (isSome(license.metadata.spdx_id)) {
      notice += 'SPDX License Identifier: ' + license.metadata.spdx_id + '\n\n';
    }

    if (license.permissions && license.permissions.length) {
      notice += 'PERMISSIONS:\n';
      for (var i = 0; i < license.permissions.length; i++) {
        notice += '  - ' + license.permissions[i] + '\n';
      }
      notice += '\n';
    }

    if (license.conditions && license.conditions.length) {
      notice += 'CONDITIONS:\n';
      for (var i2 = 0; i2 < license.conditions.length; i2++) {
        notice += '  - ' + license.conditions[i2] + '\n';
      }
      notice += '\n';
    }

    if (license.restrictions && license.restrictions.length) {
      notice += 'RESTRICTIONS:\n';
      for (var i3 = 0; i3 < license.restrictions.length; i3++) {
        notice += '  - ' + license.restrictions[i3] + '\n';
      }
      notice += '\n';
    }

    if (license.warranty_disclaimer) {
      notice += license.warranty_disclaimer;
      notice += '\n';
    }

    return notice;
  }

  // ── Copying ────────────────────────────────────────────────────────────────

  function exportCopying(license) {
    var copying = '';
    var sep = rep('=', 60);
    var thin_sep = rep('-', 60);

    copying += sep + '\n';
    copying += '  ' + license.metadata.name + '\n';
    copying += '  Version ' + license.metadata.version + '\n';
    copying += sep + '\n';
    copying += '\n';

    copying += 'Category: ' + license.metadata.category + '\n';
    if (isSome(license.metadata.spdx_id)) copying += 'SPDX ID: ' + license.metadata.spdx_id + '\n';
    copying += '\n';

    copying += 'Copyright holders:\n';
    var authors = license.metadata.authors || [];
    for (var a = 0; a < authors.length; a++) {
      var entry = '  ' + authors[a].name;
      if (isSome(authors[a].organization)) entry += ' (' + authors[a].organization + ')';
      if (isSome(authors[a].email)) entry += ' <' + authors[a].email + '>';
      if (isSome(authors[a].url)) entry += ' [' + authors[a].url + ']';
      copying += entry + '\n';
    }
    copying += '\n';

    copying += 'This license governs the use, copying, distribution, and modification\n';
    copying += 'of the software.\n\n';

    if (license.preamble) {
      copying += 'PREAMBLE\n';
      copying += thin_sep + '\n';
      copying += license.preamble + '\n\n';
    }

    var clauses = sortedClauses(license);
    for (var c = 0; c < clauses.length; c++) {
      var title = clauses[c].name.toUpperCase() + ' (Section ' + clauses[c].priority + ')';
      copying += title + '\n';
      copying += rep('-', utf8Len(title)) + '\n';
      copying += clauses[c].content + '\n\n';
    }

    if (license.permissions && license.permissions.length) {
      copying += 'PERMISSIONS\n';
      copying += thin_sep + '\n';
      for (var p = 0; p < license.permissions.length; p++) {
        copying += '  ' + license.permissions[p] + '\n';
      }
      copying += '\n';
    }

    if (license.conditions && license.conditions.length) {
      copying += 'CONDITIONS\n';
      copying += thin_sep + '\n';
      for (var c2 = 0; c2 < license.conditions.length; c2++) {
        copying += '  ' + license.conditions[c2] + '\n';
      }
      copying += '\n';
    }

    if (license.restrictions && license.restrictions.length) {
      copying += 'RESTRICTIONS\n';
      copying += thin_sep + '\n';
      for (var r = 0; r < license.restrictions.length; r++) {
        copying += '  ' + license.restrictions[r] + '\n';
      }
      copying += '\n';
    }

    if (isSome(license.patent_grant)) {
      copying += 'PATENT GRANT\n';
      copying += thin_sep + '\n';
      copying += license.patent_grant + '\n\n';
    }

    if (license.warranty_disclaimer) {
      copying += 'WARRANTY DISCLAIMER\n';
      copying += thin_sep + '\n';
      copying += license.warranty_disclaimer + '\n\n';
    }

    copying += thin_sep + '\n';
    copying += 'Blake3:    ' + license.hash.blake3 + '\n';
    copying += 'SHA-256:   ' + license.hash.sha256 + '\n';
    copying += 'SHA3-256:  ' + license.hash.sha3_256 + '\n';
    copying += thin_sep + '\n';
    copying += 'END OF LICENSE\n';

    return copying;
  }

  // ── Summary ────────────────────────────────────────────────────────────────

  function padRight(s, n) {
    var w = s.length;
    if (w >= n) return s;
    return s + rep(' ', n - w);
  }

  function exportSummary(license) {
    var m = license.metadata;
    var summary = '';

    summary += 'License:      ' + m.name + ' v' + m.version + '\n';
    summary += 'Category:     ' + m.category + '\n';
    if (isSome(m.spdx_id)) summary += 'SPDX ID:      ' + m.spdx_id + '\n';
    summary += 'Authors:      ' + authorLine(license) + '\n';
    summary += 'Created:      ' + fmtDateTime(m.created_at) + '\n';
    summary += 'Modified:     ' + fmtDateTime(m.modified_at) + '\n';
    summary += 'UUID:         ' + m.id.uuid + '\n';
    summary += 'Fingerprint:  ' + m.id.fingerprint + '\n';
    summary += '\n';

    summary += 'Clauses:      ' + (license.clauses || []).length + '\n';
    summary += 'Permissions:  ' + (license.permissions || []).length + '\n';
    summary += 'Conditions:   ' + (license.conditions || []).length + '\n';
    summary += 'Restrictions: ' + (license.restrictions || []).length + '\n';
    summary += 'Patent grant: ' + (isSome(license.patent_grant) ? 'Yes' : 'No') + '\n';
    summary += 'Warranty:     ' + (license.warranty_disclaimer ? 'Disclaimer included' : 'None') + '\n';
    summary += '\n';

    var cc = categoryCounts(license.clauses);
    summary += 'Clause breakdown:\n';
    for (var i = 0; i < cc.order.length; i++) {
      summary += '  ' + padRight(cc.order[i], 20) + ' ' + cc.counts[cc.order[i]] + '\n';
    }
    summary += '\n';

    summary += 'Hashes:\n';
    summary += '  Blake3:    ' + license.hash.blake3 + '\n';
    summary += '  SHA-256:   ' + license.hash.sha256 + '\n';
    summary += '  SHA3-256:  ' + license.hash.sha3_256 + '\n';
    summary += '\n';

    summary += 'Full text length:  ' + utf8Len(license.full_text) + ' chars\n';

    return summary;
  }

  // ── AI Summary (rule-based) ────────────────────────────────────────────────

  function containsAny(s, needles) {
    var lower = String(s).toLowerCase();
    for (var i = 0; i < needles.length; i++) {
      if (lower.indexOf(needles[i]) !== -1) return true;
    }
    return false;
  }

  function exportAiSummary(license) {
    var m = license.metadata;
    var ai = '';

    ai += '# AI Summary: ' + m.name + ' v' + m.version + '\n\n';
    ai += '**Category:** ' + m.category + '\n\n';

    if (m.description && m.description !== '') {
      ai += '**Description:** ' + m.description + '\n\n';
    }

    ai += '**SPDX License Identifier:** `' + spdxLicenseId(license) + '`\n\n';

    if (license.permissions && license.permissions.length) {
      ai += '**This license permits:**\n';
      for (var p = 0; p < license.permissions.length; p++) {
        ai += '- ' + license.permissions[p] + '\n';
      }
      ai += '\n';
    }

    if (license.conditions && license.conditions.length) {
      ai += '**This license requires:**\n';
      for (var c = 0; c < license.conditions.length; c++) {
        ai += '- ' + license.conditions[c] + '\n';
      }
      ai += '\n';
    }

    if (license.restrictions && license.restrictions.length) {
      ai += '**This license restricts:**\n';
      for (var r = 0; r < license.restrictions.length; r++) {
        ai += '- ' + license.restrictions[r] + '\n';
      }
      ai += '\n';
    }

    if (isSome(license.patent_grant)) {
      ai += '**Patent grant:** ' + license.patent_grant + '\n\n';
    }

    if (license.warranty_disclaimer) {
      ai += '**Warranty disclaimer:** ' + license.warranty_disclaimer + '\n\n';
    }

    var cc = categoryCounts(license.clauses);
    ai += '**Clause breakdown:**\n';
    for (var i = 0; i < cc.order.length; i++) {
      ai += '- ' + cc.order[i] + ': ' + cc.counts[cc.order[i]] + '\n';
    }
    ai += '\n';

    ai += '**Total clauses:** ' + (license.clauses || []).length + '\n\n';

    if (isSome(license.patent_grant)) {
      ai += '**Contains explicit patent grant:** Yes\n\n';
    } else {
      ai += '**Contains explicit patent grant:** No\n\n';
    }

    var has_copyleft = containsAny((license.conditions || []).join(' '), ['copyleft', 'same license']);
    var has_commercial = containsAny((license.restrictions || []).join(' '), ['commercial', 'non-commercial']);
    var has_ai_restriction = containsAny((license.restrictions || []).join(' '), ['machine learning', 'artificial intelligence', 'ai training']);

    ai += '**License characteristics:**\n';
    ai += '- Copyleft: ' + (has_copyleft ? 'Yes' : 'No') + '\n';
    ai += '- Commercial use restricted: ' + (has_commercial ? 'Yes' : 'No') + '\n';
    ai += '- AI training restricted: ' + (has_ai_restriction ? 'Yes' : 'No') + '\n';
    ai += '- Public domain: ' + (m.category === 'PublicDomain' ? 'Yes' : 'No') + '\n';

    ai += '\n';
    ai += '**License hash (Blake3):** `' + license.hash.blake3 + '`\n';

    return ai;
  }

  // ══ LicenseOutput::generate_* (src/license.rs) for generateAll ════════════

  function genMarkdown(license) {
    var m = license.metadata;
    var md = '';

    md += '# ' + m.name + '\n\n';
    md += '**Version:** ' + m.version + '\n\n';
    md += '**Category:** ' + m.category + '\n\n';

    if (m.authors && m.authors.length) {
      md += '**Authors:**\n';
      for (var i = 0; i < m.authors.length; i++) {
        md += '- ' + m.authors[i].name + ' ' + (isSome(m.authors[i].email) ? '<' + m.authors[i].email + '>' : '') + '\n';
      }
      md += '\n';
    }

    md += '**Created:** ' + fmtDateTime(m.created_at) + '\n\n';
    md += '**Modified:** ' + fmtDateTime(m.modified_at) + '\n\n';

    if (m.tags && m.tags.length) {
      md += '**Tags:** ' + m.tags.join(', ') + '\n\n';
    }

    if (license.preamble) {
      md += '## Preamble\n\n' + license.preamble + '\n\n';
    }

    var clauses = sortedClauses(license);
    if (clauses.length) {
      md += '## Clauses\n\n';
      for (var c = 0; c < clauses.length; c++) {
        md += '### ' + clauses[c].name + '\n\n' + clauses[c].content + '\n\n';
      }
    }

    if (license.permissions && license.permissions.length) {
      md += '## Permissions\n\n';
      for (var p = 0; p < license.permissions.length; p++) {
        md += '- ' + license.permissions[p] + '\n';
      }
      md += '\n';
    }

    if (license.conditions && license.conditions.length) {
      md += '## Conditions\n\n';
      for (var co = 0; co < license.conditions.length; co++) {
        md += '- ' + license.conditions[co] + '\n';
      }
      md += '\n';
    }

    if (license.restrictions && license.restrictions.length) {
      md += '## Restrictions\n\n';
      for (var r = 0; r < license.restrictions.length; r++) {
        md += '- ' + license.restrictions[r] + '\n';
      }
      md += '\n';
    }

    if (isSome(license.patent_grant)) {
      md += '## Patent Grant\n\n' + license.patent_grant + '\n\n';
    }

    if (license.warranty_disclaimer) {
      md += '## Warranty Disclaimer\n\n' + license.warranty_disclaimer + '\n\n';
    }

    md += '---\n\n';
    md += '*Blake3: `' + license.hash.blake3 + '`*\n';
    md += '*SHA-256: `' + license.hash.sha256 + '`*\n';
    md += '*SHA3-256: `' + license.hash.sha3_256 + '`*\n';

    return md;
  }

  function genHtml(license) {
    var m = license.metadata;
    var html = '';
    html += '<!DOCTYPE html>\n<html lang="en">\n<head>\n';
    html += '  <meta charset="UTF-8">\n';
    html += '  <title>' + escHtml(m.name) + '</title>\n';
    html += "  <style>\n    body { font-family: sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; }\n";
    html += '    h1 { border-bottom: 2px solid #333; padding-bottom: 0.5rem; }\n';
    html += '    .meta { color: #666; margin-bottom: 2rem; }\n    pre { background: #f5f5f5; padding: 1rem; overflow-x: auto; }\n';
    html += '  </style>\n</head>\n<body>\n';
    html += '  <h1>' + escHtml(m.name) + '</h1>\n';
    html += '  <div class="meta">\n    <p><strong>Version:</strong> ' + escHtml(m.version) + '</p>\n';
    html += '    <p><strong>Category:</strong> ' + m.category + '</p>\n';
    html += '    <p><strong>Created:</strong> ' + fmtDateTime(m.created_at) + '</p>\n';
    html += '  </div>\n';

    if (license.preamble) {
      html += '  <section>\n    <h2>Preamble</h2>\n    <p>' + escHtml(license.preamble).replace(/\n/g, '<br>') + '</p>\n  </section>\n';
    }

    var clauses = sortedClauses(license);
    if (clauses.length) {
      html += '  <section>\n    <h2>Clauses</h2>\n';
      for (var c = 0; c < clauses.length; c++) {
        html += '    <h3>' + escHtml(clauses[c].name) + '</h3>\n    <p>' + escHtml(clauses[c].content).replace(/\n/g, '<br>') + '</p>\n';
      }
      html += '  </section>\n';
    }

    if (license.permissions && license.permissions.length) {
      html += '  <section>\n    <h2>Permissions</h2>\n    <ul>\n';
      for (var p = 0; p < license.permissions.length; p++) {
        html += '      <li>' + escHtml(license.permissions[p]) + '</li>\n';
      }
      html += '    </ul>\n  </section>\n';
    }

    if (license.conditions && license.conditions.length) {
      html += '  <section>\n    <h2>Conditions</h2>\n    <ul>\n';
      for (var co = 0; co < license.conditions.length; co++) {
        html += '      <li>' + escHtml(license.conditions[co]) + '</li>\n';
      }
      html += '    </ul>\n  </section>\n';
    }

    if (license.restrictions && license.restrictions.length) {
      html += '  <section>\n    <h2>Restrictions</h2>\n    <ul>\n';
      for (var r = 0; r < license.restrictions.length; r++) {
        html += '      <li>' + escHtml(license.restrictions[r]) + '</li>\n';
      }
      html += '    </ul>\n  </section>\n';
    }

    if (isSome(license.patent_grant)) {
      html += '  <section>\n    <h2>Patent Grant</h2>\n    <p>' + escHtml(license.patent_grant).replace(/\n/g, '<br>') + '</p>\n  </section>\n';
    }

    if (license.warranty_disclaimer) {
      html += '  <section>\n    <h2>Warranty Disclaimer</h2>\n    <p>' + escHtml(license.warranty_disclaimer).replace(/\n/g, '<br>') + '</p>\n  </section>\n';
    }

    html += '  <footer>\n    <p>Blake3: <code>' + escHtml(license.hash.blake3) + '</code></p>\n';
    html += '    <p>SHA-256: <code>' + escHtml(license.hash.sha256) + '</code></p>\n';
    html += '    <p>SHA3-256: <code>' + escHtml(license.hash.sha3_256) + '</code></p>\n';
    html += '  </footer>\n</body>\n</html>';

    return html;
  }

  function genYaml(license) {
    var m = license.metadata;
    var yaml = '';

    yaml += 'name: "' + m.name + '"\n';
    yaml += 'version: "' + m.version + '"\n';
    yaml += 'category: "' + m.category + '"\n';
    yaml += 'description: "' + escYamlToml(m.description) + '"\n';
    yaml += 'created_at: "' + fmtIsoZ(m.created_at) + '"\n';
    yaml += 'modified_at: "' + fmtIsoZ(m.modified_at) + '"\n';
    yaml += 'uuid: "' + m.id.uuid + '"\n';
    yaml += 'fingerprint: "' + m.id.fingerprint + '"\n';
    if (isSome(m.spdx_id)) {
      yaml += 'spdx_id: "' + m.spdx_id + '"\n';
    }

    if (m.authors && m.authors.length) {
      yaml += 'authors:\n';
      for (var a = 0; a < m.authors.length; a++) {
        yaml += '  - name: "' + m.authors[a].name + '"\n';
        if (isSome(m.authors[a].email)) yaml += '    email: "' + m.authors[a].email + '"\n';
        if (isSome(m.authors[a].organization)) yaml += '    organization: "' + m.authors[a].organization + '"\n';
        if (isSome(m.authors[a].url)) yaml += '    url: "' + m.authors[a].url + '"\n';
      }
    }

    if (m.tags && m.tags.length) {
      yaml += 'tags:\n';
      for (var t = 0; t < m.tags.length; t++) {
        yaml += '  - "' + m.tags[t] + '"\n';
      }
    }

    if (license.preamble) {
      yaml += 'preamble: |\n  ' + escYamlToml(license.preamble).replace(/\n/g, '\n  ') + '\n';
    }

    var clauses = sortedClauses(license);
    if (clauses.length) {
      yaml += 'clauses:\n';
      for (var c = 0; c < clauses.length; c++) {
        yaml += '  - name: "' + clauses[c].name + '"\n';
        yaml += '    uuid: "' + clauses[c].clause_uuid + '"\n';
        yaml += '    category: "' + catDebug(clauses[c].category) + '"\n';
        yaml += '    priority: ' + clauses[c].priority + '\n';
        yaml += '    content: |\n      ' + escYamlToml(clauses[c].content).replace(/\n/g, '\n      ') + '\n';
      }
    }

    if (license.permissions && license.permissions.length) {
      yaml += 'permissions:\n';
      for (var p = 0; p < license.permissions.length; p++) {
        yaml += '  - "' + license.permissions[p] + '"\n';
      }
    }

    if (license.conditions && license.conditions.length) {
      yaml += 'conditions:\n';
      for (var co = 0; co < license.conditions.length; co++) {
        yaml += '  - "' + license.conditions[co] + '"\n';
      }
    }

    if (license.restrictions && license.restrictions.length) {
      yaml += 'restrictions:\n';
      for (var r = 0; r < license.restrictions.length; r++) {
        yaml += '  - "' + license.restrictions[r] + '"\n';
      }
    }

    if (isSome(license.patent_grant)) {
      yaml += 'patent_grant: |\n  ' + escYamlToml(license.patent_grant).replace(/\n/g, '\n  ') + '\n';
    }

    yaml += 'warranty_disclaimer: |\n  ' + escYamlToml(license.warranty_disclaimer).replace(/\n/g, '\n  ') + '\n';

    yaml += 'blake3: "' + license.hash.blake3 + '"\n';
    yaml += 'sha256: "' + license.hash.sha256 + '"\n';
    yaml += 'sha3_256: "' + license.hash.sha3_256 + '"\n';

    return yaml;
  }

  function genToml(license) {
    var m = license.metadata;
    var toml = '';

    toml += '[metadata]\n';
    toml += 'name = "' + m.name + '"\n';
    toml += 'version = "' + m.version + '"\n';
    toml += 'category = "' + m.category + '"\n';
    toml += 'description = "' + escYamlToml(m.description) + '"\n';
    toml += 'created_at = "' + fmtIsoZ(m.created_at) + '"\n';
    toml += 'modified_at = "' + fmtIsoZ(m.modified_at) + '"\n';
    toml += 'uuid = "' + m.id.uuid + '"\n';
    toml += 'fingerprint = "' + m.id.fingerprint + '"\n';
    if (isSome(m.spdx_id)) {
      toml += 'spdx_id = "' + m.spdx_id + '"\n';
    }

    if (m.authors && m.authors.length) {
      toml += '\n[authors]\n';
      for (var a = 0; a < m.authors.length; a++) {
        toml += '[[authors.list]]\n';
        toml += 'name = "' + m.authors[a].name + '"\n';
        if (isSome(m.authors[a].email)) toml += 'email = "' + m.authors[a].email + '"\n';
        if (isSome(m.authors[a].organization)) toml += 'organization = "' + m.authors[a].organization + '"\n';
        if (isSome(m.authors[a].url)) toml += 'url = "' + m.authors[a].url + '"\n';
      }
    }

    if (m.tags && m.tags.length) {
      toml += 'tags = [';
      for (var t = 0; t < m.tags.length; t++) {
        if (t > 0) toml += ', ';
        toml += '"' + m.tags[t] + '"';
      }
      toml += ']\n';
    }

    toml += '\n';
    toml += '[hash]\n';
    toml += 'blake3 = "' + license.hash.blake3 + '"\n';
    toml += 'sha256 = "' + license.hash.sha256 + '"\n';
    toml += 'sha3_256 = "' + license.hash.sha3_256 + '"\n';

    return toml;
  }

  function yearLine(license) {
    var m = license.metadata;
    var createdYear = fmtYear(m.created_at);
    if (m.authors && m.authors.length) {
      var years = [];
      for (var i = 0; i < m.authors.length; i++) years.push(parseInt(createdYear, 10));
      var y = years.length ? years[0] : parseInt(createdYear, 10);
      for (var j = 0; j < years.length; j++) {
        if (years[j] < y) y = years[j];
      }
      var maxY = years.length ? years[0] : parseInt(fmtYear(m.modified_at), 10);
      for (var k = 0; k < years.length; k++) {
        if (years[k] > maxY) maxY = years[k];
      }
      if (y === maxY) return '' + y;
      return y + '-' + maxY;
    }
    return createdYear;
  }

  function genNotice(license) {
    var notice = '';
    notice += license.metadata.name + ' ' + license.metadata.version + '\n';
    notice += 'Copyright (c) ' + yearLine(license) + '\n';
    notice += '\n';
    notice += 'This software and associated documentation files (the "Software") are\n';
    notice += 'provided under the terms of the following license:\n\n';

    if (license.permissions && license.permissions.length) {
      notice += 'PERMISSIONS:\n';
      for (var i = 0; i < license.permissions.length; i++) {
        notice += '  - ' + license.permissions[i] + '\n';
      }
      notice += '\n';
    }

    if (license.conditions && license.conditions.length) {
      notice += 'CONDITIONS:\n';
      for (var i2 = 0; i2 < license.conditions.length; i2++) {
        notice += '  - ' + license.conditions[i2] + '\n';
      }
      notice += '\n';
    }

    if (license.restrictions && license.restrictions.length) {
      notice += 'RESTRICTIONS:\n';
      for (var i3 = 0; i3 < license.restrictions.length; i3++) {
        notice += '  - ' + license.restrictions[i3] + '\n';
      }
      notice += '\n';
    }

    if (license.warranty_disclaimer) {
      notice += license.warranty_disclaimer;
      notice += '\n';
    }

    return notice;
  }

  function genCopying(license) {
    var m = license.metadata;
    var copying = '';

    copying += rep(' ', 20) + m.name + rep(' ', 20) + '\n';
    copying += rep('=', 20 + utf8Len(m.name)) + '\n';
    copying += '\n';
    copying += 'Version: ' + m.version + '\n';
    copying += 'Category: ' + m.category + '\n';
    copying += '\n';

    if (m.authors && m.authors.length) {
      copying += 'Copyright holders:\n';
      for (var a = 0; a < m.authors.length; a++) {
        var org = isSome(m.authors[a].organization) ? ' (' + m.authors[a].organization + ')' : '';
        var email = isSome(m.authors[a].email) ? ' <' + m.authors[a].email + '>' : '';
        copying += '  ' + m.authors[a].name + org + email + '\n';
      }
      copying += '\n';
    }

    copying += 'This license governs the use, copying, distribution, and modification\n';
    copying += 'of the software.\n\n';

    if (license.preamble) {
      copying += 'PREAMBLE\n';
      copying += rep('-', 40) + '\n\n';
      copying += license.preamble + '\n\n';
    }

    var clauses = sortedClauses(license);
    for (var c = 0; c < clauses.length; c++) {
      copying += clauses[c].name.toUpperCase() + '\n';
      copying += rep('-', utf8Len(clauses[c].name)) + '\n';
      copying += clauses[c].content + '\n\n';
    }

    if (license.permissions && license.permissions.length) {
      copying += 'PERMISSIONS\n';
      copying += rep('-', 10) + '\n';
      for (var p = 0; p < license.permissions.length; p++) {
        copying += '  * ' + license.permissions[p] + '\n';
      }
      copying += '\n';
    }

    if (license.conditions && license.conditions.length) {
      copying += 'CONDITIONS\n';
      copying += rep('-', 10) + '\n';
      for (var co = 0; co < license.conditions.length; co++) {
        copying += '  * ' + license.conditions[co] + '\n';
      }
      copying += '\n';
    }

    if (license.restrictions && license.restrictions.length) {
      copying += 'RESTRICTIONS\n';
      copying += rep('-', 11) + '\n';
      for (var r = 0; r < license.restrictions.length; r++) {
        copying += '  * ' + license.restrictions[r] + '\n';
      }
      copying += '\n';
    }

    if (isSome(license.patent_grant)) {
      copying += 'PATENT GRANT\n';
      copying += rep('-', 12) + '\n';
      copying += license.patent_grant + '\n\n';
    }

    if (license.warranty_disclaimer) {
      copying += 'DISCLAIMER\n';
      copying += rep('-', 10) + '\n';
      copying += license.warranty_disclaimer + '\n\n';
    }

    copying += 'END OF LICENSE\n';

    return copying;
  }

  function genSummary(license) {
    var m = license.metadata;
    var summary = '';

    summary += 'License: ' + m.name + ' v' + m.version + '\n';
    summary += 'Category: ' + m.category + '\n';
    if (isSome(m.spdx_id)) summary += 'SPDX: ' + m.spdx_id + '\n';
    var authorNames = [];
    for (var a = 0; a < (m.authors || []).length; a++) authorNames.push(m.authors[a].name);
    summary += 'Authors: ' + authorNames.join(', ') + '\n';
    summary += 'Clauses: ' + (license.clauses || []).length + '\n';
    summary += 'Permissions: ' + (license.permissions || []).length + '\n';
    summary += 'Conditions: ' + (license.conditions || []).length + '\n';
    summary += 'Restrictions: ' + (license.restrictions || []).length + '\n';
    summary += 'Has patent grant: ' + (isSome(license.patent_grant) ? 'true' : 'false') + '\n';
    summary += 'Has warranty disclaimer: ' + (license.warranty_disclaimer ? 'true' : 'false') + '\n';
    summary += 'Blake3: ' + license.hash.blake3 + '\n';
    summary += 'Full text length: ' + utf8Len(license.full_text) + ' chars\n';

    return summary;
  }

  function genAiSummary(license) {
    var m = license.metadata;
    var ai = '';

    ai += '# AI Summary: ' + m.name + ' v' + m.version + '\n\n';
    ai += '**Category:** ' + m.category + '\n\n';

    if (m.description && m.description !== '') {
      ai += '**Description:** ' + m.description + '\n\n';
    }

    if (license.permissions && license.permissions.length) {
      ai += '**This license permits:**\n';
      for (var p = 0; p < license.permissions.length; p++) {
        ai += '- ' + license.permissions[p] + '\n';
      }
      ai += '\n';
    }

    if (license.conditions && license.conditions.length) {
      ai += '**This license requires:**\n';
      for (var c = 0; c < license.conditions.length; c++) {
        ai += '- ' + license.conditions[c] + '\n';
      }
      ai += '\n';
    }

    if (license.restrictions && license.restrictions.length) {
      ai += '**This license restricts:**\n';
      for (var r = 0; r < license.restrictions.length; r++) {
        ai += '- ' + license.restrictions[r] + '\n';
      }
      ai += '\n';
    }

    if (isSome(license.patent_grant)) {
      ai += '**Patent grant:** ' + license.patent_grant + '\n\n';
    }

    if (license.warranty_disclaimer) {
      ai += '**Warranty disclaimer:** ' + license.warranty_disclaimer + '\n\n';
    }

    var cc = categoryCounts(license.clauses);
    ai += '**Clause breakdown:**\n';
    for (var i = 0; i < cc.order.length; i++) {
      ai += '- ' + cc.order[i] + ': ' + cc.counts[cc.order[i]] + '\n';
    }

    ai += '\n**License hash (Blake3):** `' + license.hash.blake3 + '`\n';

    return ai;
  }

  function generateAll(license) {
    return {
      plain_text: license.full_text,
      markdown: genMarkdown(license),
      html: genHtml(license),
      json: exportToJson(license),
      yaml: genYaml(license),
      toml: genToml(license),
      spdx: toSpdxHeader(license),
      notice: genNotice(license),
      copying: genCopying(license),
      summary: genSummary(license),
      ai_summary: genAiSummary(license)
    };
  }

  // ── Public API ─────────────────────────────────────────────────────────────

  NS.Export = NS.Export || {};
  NS.Export.exportToText = exportToText;
  NS.Export.exportToMarkdown = exportToMarkdown;
  NS.Export.exportToHtml = exportToHtml;
  NS.Export.renderMarkdownToHtml = renderMarkdownToHtml;
  NS.Export.exportToJson = exportToJson;
  NS.Export.exportToYaml = exportToYaml;
  NS.Export.exportToToml = exportToToml;
  NS.Export.exportToXml = exportToXml;
  NS.Export.toSpdxHeader = toSpdxHeader;
  NS.Export.exportToSpdx = function (license) {
    return spdxJsonDoc(license);
  };
  NS.Export.exportCycloneDX = exportCycloneDX;
  NS.Export.generateCycloneDxSbom = generateCycloneDxSbom;
  NS.Export.exportNotice = exportNotice;
  NS.Export.exportCopying = exportCopying;
  NS.Export.exportSummary = exportSummary;
  NS.Export.exportAiSummary = exportAiSummary;
  NS.Export.generateAll = generateAll;
  NS.Export.spdxLicenseId = spdxLicenseId;
  NS.Export.authorLine = authorLine;
  NS.Export.utf8Len = utf8Len;
})();

