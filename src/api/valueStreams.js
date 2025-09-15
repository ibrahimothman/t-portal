export const getValueStreams = async () => { 

    return [
        {
          "Agency": "LA",
          "Value Stream Name": "Vehicle License Renewal",
          "Value Stream Definition/Description": "The complete lifecycle of renewing a vehicle license, from initiating the renewal request to receiving the updated documentation and ensuring legal compliance",
          "id": 1,
          "stages": [
                {
                  "Id": 2,
                  "Value Stream": "",
                  "Value Stream Stage": "Initiate Renewal Request",
                  "Description": "The act of submitting a renewal request for a vehicle license.",
                  "Value Proposition": "",
                  "Entrance Criteria": "Renewal window opens",
                  "Exit Criteria": "Request Submitted",
                  "Value Item": "Renewal request",
                  "Stakeholder": "Vehicle Owner"
                },
                {
                  "Id": 3,
                  "Value Stream": "",
                  "Value Stream Stage": "Validate Eligibility",
                  "Description": "The act of verifying that the license and vehicle meet criteria for renewal.",
                  "Value Proposition": "Eligibility confirmed.",
                  "Entrance Criteria": "Request Submitted",
                  "Exit Criteria": "Eligibility Confirmed",
                  "Value Item": "Verified license",
                  "Stakeholder": "Vehicle Owner, Licensing Authority"
                },
                {
                  "Id": 4,
                  "Value Stream": "",
                  "Value Stream Stage": "Process Payment",
                  "Description": "The act of collecting payment for the license renewal.",
                  "Value Proposition": "Payment completed.",
                  "Entrance Criteria": "Eligibility Confirmed",
                  "Exit Criteria": "Payment Successful",
                  "Value Item": "Payment receipt",
                  "Stakeholder": "Vehicle Owner, Payment Gateway"
                },
                {
                  "Id": 5,
                  "Value Stream": "",
                  "Value Stream Stage": "Update Records",
                  "Description": "Updating license and vehicle registration records in official systems.",
                  "Value Proposition": "",
                  "Entrance Criteria": "Payment Successful",
                  "Exit Criteria": "Records Updated",
                  "Value Item": "Updated registration",
                  "Stakeholder": "Licensing Authority, IT System Admin"
                },
                {
                  "Id": 6,
                  "Value Stream": "",
                  "Value Stream Stage": "Issue Renewed License",
                  "Description": "The act of generating and delivering the renewed license to the vehicle owner.",
                  "Value Proposition": "Renewed license delivered.",
                  "Entrance Criteria": "Records Updated",
                  "Exit Criteria": "License Delivered",
                  "Value Item": "Renewed license",
                  "Stakeholder": "Licensing Authority, Vehicle Owner"
                },
          ]
        },
        {
          "Agency": "LA",
          "Value Stream Name": "Vehicle registration",
          "Value Stream Definition/Description": "The end-to-end perspective of registering a vehicle, from identifying the asset need and submitting a request to approving, procuring, registering the vehicle, and assigning it to the end user.",
          "id": 2,
          "stages": 
            [
              
                {
                  "Id": 2,
                  "Value Stream": "",
                  "Value Stream Stage": "Submit Registration Request",
                  "Description": "The act of submitting a request to register a newly purchased vehicle",
                  "Value Proposition": "",
                  "Entrance Criteria": "Vehicle purchase completed",
                  "Exit Criteria": "Request Submitted",
                  "Value Item": "Registration request",
                  "Stakeholder": "Vehicle Owner"
                },
                {
                  "Id": 3,
                  "Value Stream": "",
                  "Value Stream Stage": "Verify Documents",
                  "Description": "The act of verifying the submitted documents like proof of ownership, insurance, etc.",
                  "Value Proposition": "Eligibility confirmed.",
                  "Entrance Criteria": "Request Submitted",
                  "Exit Criteria": "Eligibility Confirmed",
                  "Value Item": "Verified license",
                  "Stakeholder": "Vehicle Owner, Licensing Authority"
                },
                {
                  "Id": 4,
                  "Value Stream": "",
                  "Value Stream Stage": "Process Payment",
                  "Description": "The act of collecting payment for the vehicle registration.",
                  "Value Proposition": "Payment completed.",
                  "Entrance Criteria": "Documents Verified",
                  "Exit Criteria": "Payment Successful",
                  "Value Item": "Payment receipt",
                  "Stakeholder": "Vehicle Owner, Payment Gateway"
                },
                {
                  "Id": 5,
                  "Value Stream": "",
                  "Value Stream Stage": "Update Vehicle Records",
                  "Description": "Updating official records to reflect the registered vehicle and its ownership.",
                  "Value Proposition": "",
                  "Entrance Criteria": "Payment Successful",
                  "Exit Criteria": "Records Updated",
                  "Value Item": "Registered vehicle record",
                  "Stakeholder": "Licensing Authority, IT System Admin"
                },
                {
                  "Id": 6,
                  "Value Stream": "",
                  "Value Stream Stage": "Issue Registration Certificate",
                  "Description": "The act of generating and delivering the official vehicle registration certificate.",
                  "Value Proposition": "Certificate delivered",
                  "Entrance Criteria": "Records Updated",
                  "Exit Criteria": "Certificate Delivered",
                  "Value Item": "Registration Certificate",
                  "Stakeholder": "Licensing Authority, Vehicle Owner"
                },
            
          ]
        },
        {
          "Agency": "LA",
          "Value Stream Name": "Apply Driver License",
          "Value Stream Definition/Description": "The end-to-end perspective of applying for a driver\ufffds license, from submitting the application and verifying identity to completing tests, receiving approvals, and issuing the official license to the applicant.",
          "id": 3,
          "stages": 
            [
                {
                    "Id": 2,
                    "Value Stream": "",
                    "Value Stream Stage": "Submit Application",
                    "Description": "The act of submitting an application for a driver license (online or in-person).",
                    "Value Proposition": "",
                    "Entrance Criteria": "Eligibility age met",
                    "Exit Criteria": "Application Submitted",
                    "Value Item": "Driver License Application",
                    "Stakeholder": "Applicant, Licensing Authority"
                  },
                  {
                    "Id": 3,
                    "Value Stream": "",
                    "Value Stream Stage": "Verify Documents & Identity",
                    "Description": "Verifying submitted ID proof, age, address, and other documents.",
                    "Value Proposition": "",
                    "Entrance Criteria": "Application Submitted",
                    "Exit Criteria": "Documents Verified",
                    "Value Item": "Verified Documents",
                    "Stakeholder": "Applicant, Licensing Authority"
                  },
                  {
                    "Id": 4,
                    "Value Stream": "",
                    "Value Stream Stage": "Schedule & Take Learner's Test",
                    "Description": "Scheduling and attempting the learner�s written or computerized test.",
                    "Value Proposition": "",
                    "Entrance Criteria": "Documents Verified",
                    "Exit Criteria": "Test Attempted",
                    "Value Item": "Test Result",
                    "Stakeholder": "Applicant, Testing Center"
                  },
                  {
                    "Id": 5,
                    "Value Stream": "",
                    "Value Stream Stage": "Issue Learner's Permit",
                    "Description": "Issuing the learner�s permit to the applicant on successful test clearance.",
                    "Value Proposition": "Learner's permit issued",
                    "Entrance Criteria": "Test Passed",
                    "Exit Criteria": "Learner's Permit Issued",
                    "Value Item": "Learner�s Permit",
                    "Stakeholder": "Licensing Authority, Applicant"
                  },
                  {
                    "Id": 6,
                    "Value Stream": "",
                    "Value Stream Stage": "Schedule & Take Driving Test",
                    "Description": "Scheduling and attempting the practical driving test after the learner period.",
                    "Value Proposition": "",
                    "Entrance Criteria": "Learner�s Permit Issued",
                    "Exit Criteria": "Test Attempted",
                    "Value Item": "Driving Test Result",
                    "Stakeholder": "Applicant, Driving Examiner"
                  },
                  {
                    "Id": 7,
                    "Value Stream": "",
                    "Value Stream Stage": "Process Payment",
                    "Description": "Collecting the final payment for issuance of the driver license.",
                    "Value Proposition": "Payment completed",
                    "Entrance Criteria": "Test Passed",
                    "Exit Criteria": "Payment Successful",
                    "Value Item": "Payment Receipt",
                    "Stakeholder": "Applicant, Payment Gateway"
                  },
                  {
                    "Id": 8,
                    "Value Stream": "",
                    "Value Stream Stage": "Issue Driver License",
                    "Description": "Generating and delivering the driver license to the applicant.",
                    "Value Proposition": "License delivered",
                    "Entrance Criteria": "Payment Successful",
                    "Exit Criteria": "License Delivered",
                    "Value Item": "Driver License",
                    "Stakeholder": "Licensing Authority, Applicant"
                  }
              
            ]
        },
        {
          
          "Value Stream Name": "Acquire Asset",
          "Value Stream Definition/Description": "The end-to-end perspective of acquiring an asset, from initiating and approving the asset request to sourcing and processing procurement orders and delivering the asset to the requester.",
          "id": 4
        },
        {
          "Value Stream Name": "Acquire Material",
          "Value Stream Definition/Description": "The end-to-end perspective of acquiring material, from initiating and approving the material request to sourcing and processing procurement orders and delivering the material to the requester.",
          "id": 5
        },
        {
          "Value Stream Name": "Acquire Product",
          "Value Stream Definition/Description": "The end-to-end perspective of acquiring a product (goods or service) from establishing the need to fulfilling the need.",
          "id": 6
        },
        {
          "Value Stream Name": "Conduct Audit",
          "Value Stream Definition/Description": "The end-to-end perspective of determining the degree to which the organization is adhering to established policies and regulations.",
          "id": 7
        },
        {
          "Value Stream Name": "Create Policy",
          "Value Stream Definition/Description": "The end-to-end perspective of creating and updating policies that govern how the organization operates and how customers and partners engage with the organization or with each other.",
          "id": 8
        },
        {
          "Value Stream Name": "Deliver Event",
          "Value Stream Definition/Description": "The end-to-end perspective of planning and executing an event.",
          "id": 9
        },
        {
          "Value Stream Name": "Deliver Initiative",
          "Value Stream Definition/Description": "The end-to-end perspective of planning and executing an initiative.",
          "id": 10
        },
        {
          "Value Stream Name": "Deliver Training",
          "Value Stream Definition/Description": "The end-to-end perspective of planning, executing, and communicating learning content for the purpose of increasing knowledge.",
          "id": 11
        },
        {
          "Value Stream Name": "Deploy Asset",
          "Value Stream Definition/Description": "The end-to-end perspective of making an asset available for use within an organization and to the individual(s) making the request.",
          "id": 12
        },
        {
          "Value Stream Name": "Deploy Infrastructure",
          "Value Stream Definition/Description": "The end-to-end perspective of planning, specifying, designing, and commissioning major or minor modifications to infrastructure, including roads, railways, bridges, tunnels, stations, rail corridors, and related structures.",
          "id": 13
        },
        {
          "Value Stream Name": "Develop Human Resource Career",
          "Value Stream Definition/Description": "The end-to-end perspective of developing an individual's career, from performance assessment to skills and experience enhancement and individual redeployment.",
          "id": 14
        },
        {
          "Value Stream Name": "Disseminate Information",
          "Value Stream Definition/Description": "The end-to-end perspective of requesting, creating, and delivering information products to requester.",
          "id": 15
        },
        {
          "Value Stream Name": "Ensure Policy Compliance",
          "Value Stream Definition/Description": "The end-to-end perspective of ensuring compliance with legislation and organization-driven policies, from identifying compliance requirements, implementing controls, evaluating controls' effectiveness, addressing compliance incidents, and reporting compliance as required.",
          "id": 16
        },
        {
          "Value Stream Name": "Establish Agreement",
          "Value Stream Definition/Description": "The end-to-end perspective of establishing a new or updating an existing agreement with a customer or formalizing other agreements not addressed in the normal course of business.",
          "id": 17
        },
        {
          "Value Stream Name": "Establish Network",
          "Value Stream Definition/Description": "The end-to-end perspective of assessing, planning, designing, and instantiating a network within geographical scopes, for scheduled periods of time, and planned events and interventions.",
          "id": 18
        },
        {
          "Value Stream Name": "Establish Route",
          "Value Stream Definition/Description": "The end-to-end perspective of planning and establishing a transportation route.",
          "id": 19
        },
        {
          "Value Stream Name": "Execute Campaign",
          "Value Stream Definition/Description": "The end-to-end perspective of executing a campaign, from identifying the need for a campaign to planning, designing, implementing, and measuring the effectiveness of the campaign.",
          "id": 20
        },
        {
          "Value Stream Name": "Execute Operation",
          "Value Stream Definition/Description": "The end-to-end perspective of planning, initiating, running, and terminating an operation.",
          "id": 21
        },
        {
          "Value Stream Name": "Execute Route",
          "Value Stream Definition/Description": "The end-to-end perspective of transporting or moving a conveyer from one location to another safely and efficiently while meeting regulatory compliance.",
          "id": 22
        },
        {
          "Value Stream Name": "Make a Trip",
          "Value Stream Definition/Description": "The end-to-end perspective of a customer or customers planning and preparing for a trip, departing and arriving at waypoints or final destinations, and terminating the trip, using any means of conveyance appropriate to completing the trip.",
          "id": 23
        },
        {
          "Value Stream Name": "Onboard Human Resource",
          "Value Stream Definition/Description": "The end-to-end perspective of identifying, exploring, and selecting an individual to fill a need within an organization.",
          "id": 24
        },
        {
          "Value Stream Name": "Onboard Partner",
          "Value Stream Definition/Description": "The end-to-end perspective of identifying and commencing business with other organizations for mutual benefit.",
          "id": 25
        },
        {
          "Value Stream Name": "Optimize Asset & Material Inventory",
          "Value Stream Definition/Description": "The end-to-end perspective of planning, assessing, maintaining, and provisioning installed and stored assets and materials in order to provide an agreed optimum level of availability and stock.",
          "id": 26
        },
        {
          "Value Stream Name": "Optimize Investments",
          "Value Stream Definition/Description": "The end-to-end perspective of deciding where to make investments, based on the understanding of the enterprise's goals, strategy, current positions, and external forces.",
          "id": 27
        },
        {
          "Value Stream Name": "Optimize Network",
          "Value Stream Definition/Description": "The end-to-end perspective of assessing, designing, and initiating modifications to a network for planned events, interventions, recovering from unplanned incidents, and streamlining real-time activity.",
          "id": 28
        },
        {
          "Value Stream Name": "Optimize Routes & Schedules",
          "Value Stream Definition/Description": "The end-to-end perspective of assessing, planning, and revising a set of connected or related routes and schedules.",
          "id": 29
        },
        {
          "Value Stream Name": "Report Financials",
          "Value Stream Definition/Description": "The end-to-end perspective of preparing, approving, and releasing external financial statements that disclose an organization's financial status to management, investors, and the government.",
          "id": 30
        },
        {
          "Value Stream Name": "Respond to Emergency",
          "Value Stream Definition/Description": "The end-to-end perspective of identifying, scoping, mobilizing, and otherwise responding to an emergency incident.",
          "id": 31
        },
        {
          "Value Stream Name": "Send Shipment",
          "Value Stream Definition/Description": "The end-to-end perspective of planning, initiating, packaging, sending, tracking, and receiving one or more shipment items from one location to another.",
          "id": 32
        },
        {
          "Value Stream Name": "Settle Financial Accounts",
          "Value Stream Definition/Description": "The end-to-end perspective of enabling the bi-directional settlement of payments between an organization and a customer, partner, or employee.",
          "id": 33
        }
      ]
}