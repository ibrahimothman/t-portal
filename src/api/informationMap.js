export const getInformationMapData = async () => {
    return [
        {
          id: 1,
          "Information Concept": "Brand ",
          "Information Concept Category": "Primary",
          "Information Concept Definition": "A name, symbol, or design that identifies and differentiates products, offerings, or organizational identities. ",
          "Information Concept Types ": "Name, Symbol, Mark, Logo, Tagline, Service Mark, Jingle, Sound",
          "Related Information Concepts": "Market, Product, Business Entity, Intellectual Property Rights, Policy, Channel, Partner, Campaign, Incident, Inquiry, Message",
          "Information Concept States": "Proposed, Accepted, Retired"
        },
        {
          id: 2,
          "Information Concept": "Business Entity ",
          "Information Concept Category": "Primary",
          "Information Concept Definition": "A legal body or bodies that comprises or comprise a single organization. ",
          "Information Concept Types ": "For-Profit, Not-for-Profit, For-Benefit, Corporation, Partnership, Sole Proprietorship, Government Organizations",
          "Related Information Concepts": "Investment, Job, Asset, Brand, Incident, Inquiry, Market, Message, Financial Forecast",
          "Information Concept States": "Extant, Non-Extant, Temporary, In-Formation"
        },
        {
          id: 3,
          "Information Concept": "Campaign ",
          "Information Concept Category": "Primary",
          "Information Concept Definition": "An outreach activity that targets a specific population, for example, customers, human resources, partners, and patients, to achieve a certain goal, such as marketing awareness, hiring activities, and health awareness.",
          "Information Concept Types ": "Internal, External",
          "Related Information Concepts": "Product, Market, Brand, Meeting, Finance, Intellectual Property Rights, Job, Location, Plan, Policy, Initiative, Strategy, Training, Customer, Channel",
          "Information Concept States": "Planned, Designed, Launched, In-Process, Completed, Terminated"
        },
        {
          id: 4,
          "Information Concept": "Geographic Space",
          "Information Concept Category": "Primary",
          "Information Concept Definition": "A physical area across land, air, and water, in order to provide for the well-being of, and enable or restrict access to, that space as needed to meet economic, environmental, security, health, recreational, and other needs that arise. ",
          "Information Concept Types ": "National Land Territory, National Waters and Air Space Territory, Conservation Area, Indigenous Area, Rural Parcel, Urban Parcel, Restricted Access Area, Area of Total Protection, Area of Partial Protection, Public Use Areas",
          "Related Information Concepts": "Agreement, Plan",
          "Information Concept States": "Planned for Use, Being Developed, Developed, In Use"
        },
        {
          id: 5,
          "Information Concept": "Geographic Border",
          "Information Concept Category": "Secondary",
          "Information Concept Definition": "A line of demarcation around a geographic space or between one geographic space and another geographic space.",
          "Information Concept Types ": "Natural, Declared ",
          "Related Information Concepts": "Policy, Location, Partner, Strategy, Incident, Dispute, Government Service, Agreement",
          "Information Concept States": "Declared, Recognized, Disputed, Historical"
        },
        {
          id: 6,
          "Information Concept": "Geographic Space Cadaster",
          "Information Concept Category": "Secondary",
          "Information Concept Definition": "A geometric description of area parcels, extent, value, ownership, tenure, rights, restrictions, and responsibilities associated with a property area or space. ",
          "Information Concept Types ": "Property",
          "Related Information Concepts": "Legislation, Location, Constituent, Objective, Dispute, Government Service, Agreement, License, Tax",
          "Information Concept States": "Pending/Planned/Considered, Delimited, Registered, Titled, Monitored"
        },
        {
          id: 7,
          "Information Concept": "Intellectual Property Rights",
          "Information Concept Category": "Primary",
          "Information Concept Definition": "Legal protections, such as patents, trademarks, and copyrights.",
          "Information Concept Types ": "Patent, Copyright, Trademark, Trade Secret",
          "Related Information Concepts": "Business Entity, Product, Brand, Campaign, Legal Proceeding, Content",
          "Information Concept States": "Incipient, Applied-for, Granted"
        },
        {
          id: 8,
          "Information Concept": "Investment",
          "Information Concept Category": "Primary",
          "Information Concept Definition": "Any type of monetary asset purchased with the idea that the asset will provide income in the future or will be sold at a higher price for a profit.",
          "Information Concept Types ": "Financial Instrument, Property",
          "Related Information Concepts": "Strategy, Plan, Asset, Payment, Policy, Research",
          "Information Concept States": "Pending/Planned/Considered, Purchased/Acquired, Sold/Matured/Expired"
        },
        {
          id: 9,
          "Information Concept": "Market ",
          "Information Concept Category": "Primary",
          "Information Concept Definition": "Individuals, populations of individuals, or organizations that constitute the demand for existing or future products and services.",
          "Information Concept Types ": "Regional, Conceptual, Locational, Non-Locational",
          "Related Information Concepts": "Brand, Location, Campaign, Customer, Event, Product",
          "Information Concept States": "Latent, Explicit"
        },
        {
          id: 10,
          "Information Concept": "Plan ",
          "Information Concept Category": "Primary",
          "Information Concept Definition": "An articulated direction, related work items, and priorities to further the organization's goals and objectives across organizational units and entities within or outside the organization.",
          "Information Concept Types ": "Strategic, Tactical, Operational",
          "Related Information Concepts": "Asset, Investment, Policy, Initiative, Strategy, Training, Campaign, Competency, Customer, Event, Facility, Human Resource, Job, Product",
          "Information Concept States": "Pending, Initiated, Completed, Terminated"
        },
        {
          id: 11,
          "Information Concept": "Policy ",
          "Information Concept Category": "Primary",
          "Information Concept Definition": "A statute, legislation, rule, procedure, regulation, treaty, or principle driven by internal business directives or external organizations, governments, or related third-party actors.",
          "Information Concept Types ": "Formal, Informal, Temporary, Permanent",
          "Related Information Concepts": "Policy, Location, Authored Item",
          "Information Concept States": "Draft, Proposed, Adopted, Rescinded"
        },
        {
          id: 12,
          "Information Concept": "Research ",
          "Information Concept Category": "Primary",
          "Information Concept Definition": "Established facts and conclusions resulting from systematic investigation into materials and sources.",
          "Information Concept Types ": "Primary, Secondary, Qualitative, Quantitative",
          "Related Information Concepts": "Initiative, Product, Human Resource, Inquiry, Investment, Job, Legal Proceeding, Strategy, Market",
          "Information Concept States": "Planned, Ongoing, Concluded"
        },
        {
          id: 13,
          "Information Concept": "Strategy ",
          "Information Concept Category": "Primary",
          "Information Concept Definition": "An integrated pattern and perspective that aligns an organizations goals, objectives, and action sequences into a cohesive whole.",
          "Information Concept Types ": "Product, Market, Operation",
          "Related Information Concepts": "Strategy, Research, Market, Policy",
          "Information Concept States": "Planned, Ongoing, Concluded"
        },
        {
          id: 14,
          "Information Concept": "Action Item",
          "Information Concept Category": "Secondary",
          "Information Concept Definition": "A specific course to be taken to achieve an objective.",
          "Information Concept Types ": "Financial, Operational, Organizational, Cultural",
          "Related Information Concepts": null,
          "Information Concept States": "Proposed, Pending, Initiated, Closed, Rejected"
        },
        {
          id: 15,
          "Information Concept": "Goal",
          "Information Concept Category": "Secondary",
          "Information Concept Definition": "An end toward which effort is or should be directed.",
          "Information Concept Types ": "Strategic, Tactical, Operational",
          "Related Information Concepts": "Objective",
          "Information Concept States": "Defined, Undefined, Abandoned"
        },
        {
          id: 16,
          "Information Concept": "Objective",
          "Information Concept Category": "Secondary",
          "Information Concept Definition": "A quantitative, measurable result that defines strategy.",
          "Information Concept Types ": "Financial, Operational, Organizational, Cultural",
          "Related Information Concepts": "Objective, Action Item",
          "Information Concept States": "Defined, Undefined, Abandoned"
        },
        {
          id: 17,
          "Information Concept": "Vision",
          "Information Concept Category": "Secondary",
          "Information Concept Definition": "An imagined future state of being. ",
          "Information Concept Types ": "Enterprise, Business Unit",
          "Related Information Concepts": "Goal",
          "Information Concept States": "Developing, Current, Superseded, Abandoned"
        },
        {
          id: 18,
          "Information Concept": "Agreement",
          "Information Concept Category": "Primary",
          "Information Concept Definition": "A set of legally binding rights and obligations between two or more legal entities.",
          "Information Concept Types ": "Bilateral, Unilateral, Express, Implied, Executed, Executory, Aleatory",
          "Related Information Concepts": "Customer, Partner, Product, Asset, Policy, Order, Agreement, Financial Account, Payment, Facility, Channel, Conveyor, Network, Tax",
          "Information Concept States": "Pending, In Force, Terminated, Abandoned"
        },
        {
          id: 19,
          "Information Concept": "Agreement Term",
          "Information Concept Category": "Secondary",
          "Information Concept Definition": "A legally enforceable condition set forth within the bounds of an agreement. ",
          "Information Concept Types ": "Condition, Warranty, Innominate",
          "Related Information Concepts": "Policy, Time, Location",
          "Information Concept States": "Pending, In Force, Terminated, Abandoned"
        },
        {
          id: 20,
          "Information Concept": "Asset ",
          "Information Concept Category": "Primary ",
          "Information Concept Definition": "Tangible or intangible property.",
          "Information Concept Types ": "Tangible, Intangible",
          "Related Information Concepts": "Agreement, Business Entity, Customer, Event, Facility, Incident, Inquiry, Investment, Job, Location, Message, Partner, Plan, Product, Initiative\n",
          "Information Concept States": "Requested, In-Preparation, In-Use, Retired, Disposed"
        },
        {
          id: 21,
          "Information Concept": "Channel",
          "Information Concept Category": "Primary",
          "Information Concept Definition": "A digital, analog, or physical conduit through which products, related services, or communications are delivered or received, including the Internet, phone, delivery service, satellite, radio, or physical means.",
          "Information Concept Types ": "Digital, Analog, Physical",
          "Related Information Concepts": "Partner, Policy, Product, Asset, Facility, Location",
          "Information Concept States": "Pending, Active, Retired"
        },
        {
          id: 22,
          "Information Concept": "Conveyor",
          "Information Concept Category": "Primary",
          "Information Concept Definition": "Any variety of an apparatus, whether human- or robot-piloted, that has the capacity to transport people, animals, goods, assets, or other physical items, and includes, but is not limited to trucks, carts, automobiles, rail-based vehicles and assemblies, air-borne craft, water-borne craft, animal-pulled devices, and animal-assemblies.",
          "Information Concept Types ": "Propulsion - Human-powered, Fuel-powered, Animal-powered\nCarriage - Human, Cargo\nMode - Rail, Road, Water, Air, Pipeline",
          "Related Information Concepts": "Agreement, Asset, Business Entity, Conveyor, Customer, Event, Human Resource, Incident, Inquiry, Intellectual Property, Job, Legal Proceeding, Location, Message, Operation, Order, Plan, Policy, Product, Initiative, Route, Shipment, Trip, Work",
          "Information Concept States": "Planned, Designed, Prepared, Deployed, Active, Retirement, Retired"
        },
        {
          id: 23,
          "Information Concept": "Customer",
          "Information Concept Category": "Primary",
          "Information Concept Definition": "A legal entity that has, plans to have, or has had an agreement with the organization, or is a recipient or beneficiary of the organization's products or services.",
          "Information Concept Types ": "Individual, Organization",
          "Related Information Concepts": "Strategy, Plan, Initiative, Market, Product, Customer, Partner, Human Resource, Channel, Location, Policy",
          "Information Concept States": "Potential, Actual, Past"
        },
        {
          id: 24,
          "Information Concept": "Incident",
          "Information Concept Category": "Primary",
          "Information Concept Definition": "An unexpected, disruptive, or potentially disruptive, occurrence.",
          "Information Concept Types ": "Type - Variation, Accident, Failure\nSubject - Environmental, Traffic, Security, Technology\nScale - Small, Medium, Large\nSeverity - Fatal, Non-Fatal",
          "Related Information Concepts": "Plan, Policy, Strategy, Event, Initiative, Brand, Work Item, Custom, Channel, Asset, Conveyor, Infrastructure, Product, Partner, Shipment, Trip, Financial Transaction, Financial Account, Legal Proceeding, Human Resource, Inquiry, Event",
          "Information Concept States": "Occurred, Notified, Assessed, Planned, Actioned, Resolved, Closed"
        },
        {
          id: 25,
          "Information Concept": "Infrastructure",
          "Information Concept Category": "Primary",
          "Information Concept Definition": "A physical structure or facility, which may include, for example, a building, station, bridge, tunnel, rail corridor, or roadway.",
          "Information Concept Types ": "Type - Civil, Commercial, Private\nUsage - Facility, Conduit",
          "Related Information Concepts": "Location, Asset, Business Entity, Competency, Infrastructure, Investment, Partner, Plan, Policy, Initiative, Work Item",
          "Information Concept States": "Planned, Designed, Built, In-Use, Inactive, Decommissioned, Demolished"
        },
        {
          id: 26,
          "Information Concept": "Infrastructure",
          "Information Concept Category": "Primary",
          "Information Concept Definition": "A physical structure or facility, which may include, for example, a building, station, bridge, tunnel, rail corridor, or roadway.",
          "Information Concept Types ": "Type - Civil, Commercial, Private\nUsage - Facility, Conduit",
          "Related Information Concepts": "Location, Asset, Business Entity, Competency, Infrastructure, Investment, Partner, Plan, Policy, Initiative, Work Item",
          "Information Concept States": "Planned, Designed, Built, In-Use, Inactive, Decommissioned, Demolished"
        },
        {
          id: 26,
          "Information Concept": "Material",
          "Information Concept Category": "Primary", 
          "Information Concept Definition": "Physical matter used in the construction and maintenance of assets and infrastructure, and the powering of physical products and conveyors.",
          "Information Concept Types ": "Raw Materials, Supplied Parts, Subassemblies, Fuel",
          "Related Information Concepts": "Product, Operation, Order, Partner, Conveyor",
          "Information Concept States": "Inert, Active"
        },
        {
          id: 27,
          "Information Concept": "Message ",
          "Information Concept Category": "Primary",
          "Information Concept Definition": "A verbal, written, recorded, or digitally-represented communication, including missives, notifications, alerts, and other internally or externally targeted communication about the organization's mission, products, plans, activities, and other focal points.",
          "Information Concept Types ": "Internal (Inbound), External (Outbound)",
          "Related Information Concepts": "Asset, Brand, Event, Human Resource, Inquiry, Legal Proceeding, Policy, Initiative, Strategy, Work, Agreement, Customer, Channel, Partner, Product, Financial Account, Financial Transaction, Content",
          "Information Concept States": "Formulating, Formulated"
        },
        {
          id: 28,
          "Information Concept": "Network",
          "Information Concept Category": "Primary",
          "Information Concept Definition": "A set of connected arcs and nodes that may be associated with a system of infrastructure, assets, locations, routes, and other business objects.",
          "Information Concept Types ": "Abstract - Physical, Virtual\nMode - Road, Rail, Air, Footway, Waterway, Distribution, Data, Neural, Pipeline",
          "Related Information Concepts": "Asset, Location, Network, Plan",
          "Information Concept States": "Proposed, Planned, Defined, Active, Inactive, Retired"
        },
        {
          id: 29,
          "Information Concept": "Network Arc",
          "Information Concept Category": "Secondary",
          "Information Concept Definition": "A connection or association between nodes in a network. ",
          "Information Concept Types ": "Lane, Waterway Channel, Street, Road, Path, Air Corridor, Line",
          "Related Information Concepts": "Network, Location, Asset, Business Entity, Competency, Infrastructure, Investment, Partner, Plan, Policy, Initiative, Work Item",
          "Information Concept States": "Proposed, Planned, Defined, Active, Inactive, Retired"
        },
        {
          id: 30,
          "Information Concept": "Infrastructure",
          "Information Concept Category": "Primary",
          "Information Concept Definition": "A physical structure or facility, which may include, for example, a building, station, bridge, tunnel, rail corridor, or roadway.",
          "Information Concept Types ": "Type - Civil, Commercial, Private\nUsage - Facility, Conduit",
          "Related Information Concepts": "Location, Asset, Business Entity, Competency, Infrastructure, Investment, Partner, Plan, Policy, Initiative, Work Item",
          "Information Concept States": "Planned, Designed, Built, In-Use, Inactive, Decommissioned, Demolished"
        },
        {
          id: 31,
          "Information Concept": "Material",
          "Information Concept Category": "Primary",
          "Information Concept Definition": "Physical matter used in the construction and maintenance of assets and infrastructure, and the powering of physical products and conveyors.",
          "Information Concept Types ": "Raw Materials, Supplied Parts, Subassemblies, Fuel",
          "Related Information Concepts": "Product, Operation, Order, Partner, Conveyor",
          "Information Concept States": "Inert, Active"
        },
        {
          id: 32,
          "Information Concept": "Message ",
          "Information Concept Category": "Primary",
          "Information Concept Definition": "A verbal, written, recorded, or digitally-represented communication, including missives, notifications, alerts, and other internally or externally targeted communication about the organization's mission, products, plans, activities, and other focal points.",
          "Information Concept Types ": "Internal (Inbound), External (Outbound)",
          "Related Information Concepts": "Asset, Brand, Event, Human Resource, Inquiry, Legal Proceeding, Policy, Initiative, Strategy, Work, Agreement, Customer, Channel, Partner, Product, Financial Account, Financial Transaction, Content",
          "Information Concept States": "Formulating, Formulated"
        },
        {
          id: 33,
          "Information Concept": "Network",
          "Information Concept Category": "Primary",
          "Information Concept Definition": "A set of connected arcs and nodes that may be associated with a system of infrastructure, assets, locations, routes, and other business objects.",
          "Information Concept Types ": "Abstract - Physical, Virtual\nMode - Road, Rail, Air, Footway, Waterway, Distribution, Data, Neural, Pipeline",
          "Related Information Concepts": "Asset, Location, Network, Plan",
          "Information Concept States": "Proposed, Planned, Defined, Active, Inactive, Retired"
        },
      
      ]
}