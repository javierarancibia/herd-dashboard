import { TextractClient, AnalyzeDocumentCommand } from "@aws-sdk/client-textract"; // ES Modules import
// const { TextractClient, AnalyzeDocumentCommand } = require("@aws-sdk/client-textract"); // CommonJS import
const client = new TextractClient(config);
const input = { // AnalyzeDocumentRequest
  Document: { // Document
    Bytes: "BLOB_VALUE",
    S3Object: { // S3Object
      Bucket: "STRING_VALUE",
      Name: "STRING_VALUE",
      Version: "STRING_VALUE",
    },
  },
  FeatureTypes: [ // FeatureTypes // required
    "TABLES" || "FORMS" || "QUERIES" || "SIGNATURES" || "LAYOUT",
  ],
  HumanLoopConfig: { // HumanLoopConfig
    HumanLoopName: "STRING_VALUE", // required
    FlowDefinitionArn: "STRING_VALUE", // required
    DataAttributes: { // HumanLoopDataAttributes
      ContentClassifiers: [ // ContentClassifiers
        "FreeOfPersonallyIdentifiableInformation" || "FreeOfAdultContent",
      ],
    },
  },
  QueriesConfig: { // QueriesConfig
    Queries: [ // Queries // required
      { // Query
        Text: "STRING_VALUE", // required
        Alias: "STRING_VALUE",
        Pages: [ // QueryPages
          "STRING_VALUE",
        ],
      },
    ],
  },
  AdaptersConfig: { // AdaptersConfig
    Adapters: [ // Adapters // required
      { // Adapter
        AdapterId: "STRING_VALUE", // required
        Pages: [ // AdapterPages
          "STRING_VALUE",
        ],
        Version: "STRING_VALUE", // required
      },
    ],
  },
};
const command = new AnalyzeDocumentCommand(input);
const response = await client.send(command);
// { // AnalyzeDocumentResponse
//   DocumentMetadata: { // DocumentMetadata
//     Pages: Number("int"),
//   },
//   Blocks: [ // BlockList
//     { // Block
//       BlockType: "KEY_VALUE_SET" || "PAGE" || "LINE" || "WORD" || "TABLE" || "CELL" || "SELECTION_ELEMENT" || "MERGED_CELL" || "TITLE" || "QUERY" || "QUERY_RESULT" || "SIGNATURE" || "TABLE_TITLE" || "TABLE_FOOTER" || "LAYOUT_TEXT" || "LAYOUT_TITLE" || "LAYOUT_HEADER" || "LAYOUT_FOOTER" || "LAYOUT_SECTION_HEADER" || "LAYOUT_PAGE_NUMBER" || "LAYOUT_LIST" || "LAYOUT_FIGURE" || "LAYOUT_TABLE" || "LAYOUT_KEY_VALUE",
//       Confidence: Number("float"),
//       Text: "STRING_VALUE",
//       TextType: "HANDWRITING" || "PRINTED",
//       RowIndex: Number("int"),
//       ColumnIndex: Number("int"),
//       RowSpan: Number("int"),
//       ColumnSpan: Number("int"),
//       Geometry: { // Geometry
//         BoundingBox: { // BoundingBox
//           Width: Number("float"),
//           Height: Number("float"),
//           Left: Number("float"),
//           Top: Number("float"),
//         },
//         Polygon: [ // Polygon
//           { // Point
//             X: Number("float"),
//             Y: Number("float"),
//           },
//         ],
//       },
//       Id: "STRING_VALUE",
//       Relationships: [ // RelationshipList
//         { // Relationship
//           Type: "VALUE" || "CHILD" || "COMPLEX_FEATURES" || "MERGED_CELL" || "TITLE" || "ANSWER" || "TABLE" || "TABLE_TITLE" || "TABLE_FOOTER",
//           Ids: [ // IdList
//             "STRING_VALUE",
//           ],
//         },
//       ],
//       EntityTypes: [ // EntityTypes
//         "KEY" || "VALUE" || "COLUMN_HEADER" || "TABLE_TITLE" || "TABLE_FOOTER" || "TABLE_SECTION_TITLE" || "TABLE_SUMMARY" || "STRUCTURED_TABLE" || "SEMI_STRUCTURED_TABLE",
//       ],
//       SelectionStatus: "SELECTED" || "NOT_SELECTED",
//       Page: Number("int"),
//       Query: { // Query
//         Text: "STRING_VALUE", // required
//         Alias: "STRING_VALUE",
//         Pages: [ // QueryPages
//           "STRING_VALUE",
//         ],
//       },
//     },
//   ],
//   HumanLoopActivationOutput: { // HumanLoopActivationOutput
//     HumanLoopArn: "STRING_VALUE",
//     HumanLoopActivationReasons: [ // HumanLoopActivationReasons
//       "STRING_VALUE",
//     ],
//     HumanLoopActivationConditionsEvaluationResults: "STRING_VALUE",
//   },
//   AnalyzeDocumentModelVersion: "STRING_VALUE",
// };