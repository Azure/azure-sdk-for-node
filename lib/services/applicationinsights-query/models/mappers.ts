/*
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is
 * regenerated.
 */

import {CloudErrorMapper, BaseResourceMapper } from "ms-rest-azure-js";

export const CloudError = CloudErrorMapper;
export const BaseResource = BaseResourceMapper;

export const MetricsPostBodySchemaParameters = {
  serializedName: "metricsPostBodySchema_parameters",
  type: {
    name: "Composite",
    className: "MetricsPostBodySchemaParameters",
    modelProperties: {
      metricId: {
        serializedName: "metricId",
        type: {
          name: "String"
        }
      },
      timespan: {
        serializedName: "timespan",
        type: {
          name: "String"
        }
      },
      aggregation: {
        serializedName: "aggregation",
        type: {
          name: "Sequence",
          element: {
            serializedName: "MetricsAggregationElementType",
            type: {
              name: "Enum",
              allowedValues: [
                "min",
                "max",
                "avg",
                "sum",
                "count",
                "unique"
              ]
            }
          }
        }
      },
      interval: {
        serializedName: "interval",
        type: {
          name: "TimeSpan"
        }
      },
      segment: {
        serializedName: "segment",
        type: {
          name: "Sequence",
          element: {
            serializedName: "MetricsSegmentElementType",
            type: {
              name: "String"
            }
          }
        }
      },
      top: {
        serializedName: "top",
        type: {
          name: "Number"
        }
      },
      orderby: {
        serializedName: "orderby",
        type: {
          name: "String"
        }
      },
      filter: {
        serializedName: "filter",
        type: {
          name: "String"
        }
      }
    }
  }
};

export const MetricsPostBodySchema = {
  serializedName: "metricsPostBodySchema",
  type: {
    name: "Composite",
    className: "MetricsPostBodySchema",
    modelProperties: {
      id: {
        required: true,
        serializedName: "id",
        type: {
          name: "String"
        }
      },
      parameters: {
        required: true,
        serializedName: "parameters",
        type: {
          name: "Composite",
          className: "MetricsPostBodySchemaParameters"
        }
      }
    }
  }
};

export const MetricsSegmentInfo = {
  serializedName: "metricsSegmentInfo",
  type: {
    name: "Composite",
    className: "MetricsSegmentInfo",
    modelProperties: {
      additionalProperties: {
        type: {
          name: "Dictionary",
          value: {
            serializedName: "ObjectElementType",
            type: {
              name: "Object"
            }
          }
        }
      },
      start: {
        serializedName: "start",
        type: {
          name: "DateTime"
        }
      },
      end: {
        serializedName: "end",
        type: {
          name: "DateTime"
        }
      },
      segments: {
        serializedName: "segments",
        type: {
          name: "Sequence",
          element: {
            serializedName: "MetricsSegmentInfoElementType",
            type: {
              name: "Composite",
              className: "MetricsSegmentInfo"
            }
          }
        }
      }
    }
  }
};

export const MetricsResultInfo = {
  serializedName: "metricsResultInfo",
  type: {
    name: "Composite",
    className: "MetricsResultInfo",
    modelProperties: {
      additionalProperties: {
        type: {
          name: "Dictionary",
          value: {
            serializedName: "ObjectElementType",
            type: {
              name: "Object"
            }
          }
        }
      },
      start: {
        serializedName: "start",
        type: {
          name: "DateTime"
        }
      },
      end: {
        serializedName: "end",
        type: {
          name: "DateTime"
        }
      },
      interval: {
        serializedName: "interval",
        type: {
          name: "TimeSpan"
        }
      },
      segments: {
        serializedName: "segments",
        type: {
          name: "Sequence",
          element: {
            serializedName: "MetricsSegmentInfoElementType",
            type: {
              name: "Composite",
              className: "MetricsSegmentInfo"
            }
          }
        }
      }
    }
  }
};

export const MetricsResult = {
  serializedName: "metricsResult",
  type: {
    name: "Composite",
    className: "MetricsResult",
    modelProperties: {
      value: {
        serializedName: "value",
        type: {
          name: "Composite",
          className: "MetricsResultInfo"
        }
      }
    }
  }
};

export const MetricsResultsItem = {
  serializedName: "metricsResultsItem",
  type: {
    name: "Composite",
    className: "MetricsResultsItem",
    modelProperties: {
      id: {
        serializedName: "id",
        type: {
          name: "String"
        }
      },
      status: {
        serializedName: "status",
        type: {
          name: "Number"
        }
      },
      body: {
        serializedName: "body",
        type: {
          name: "Composite",
          className: "MetricsResult"
        }
      }
    }
  }
};

export const ErrorDetail = {
  serializedName: "errorDetail",
  type: {
    name: "Composite",
    className: "ErrorDetail",
    modelProperties: {
      code: {
        required: true,
        serializedName: "code",
        type: {
          name: "String"
        }
      },
      message: {
        required: true,
        serializedName: "message",
        type: {
          name: "String"
        }
      },
      target: {
        serializedName: "target",
        type: {
          name: "String"
        }
      },
      value: {
        serializedName: "value",
        type: {
          name: "String"
        }
      },
      resources: {
        serializedName: "resources",
        type: {
          name: "Sequence",
          element: {
            serializedName: "stringElementType",
            type: {
              name: "String"
            }
          }
        }
      },
      additionalProperties: {
        serializedName: "additionalProperties",
        type: {
          name: "Object"
        }
      }
    }
  }
};

export const ErrorInfo = {
  serializedName: "errorInfo",
  type: {
    name: "Composite",
    className: "ErrorInfo",
    modelProperties: {
      code: {
        required: true,
        serializedName: "code",
        type: {
          name: "String"
        }
      },
      message: {
        required: true,
        serializedName: "message",
        type: {
          name: "String"
        }
      },
      details: {
        serializedName: "details",
        type: {
          name: "Sequence",
          element: {
            serializedName: "ErrorDetailElementType",
            type: {
              name: "Composite",
              className: "ErrorDetail"
            }
          }
        }
      },
      innererror: {
        serializedName: "innererror",
        type: {
          name: "Composite",
          className: "ErrorInfo"
        }
      },
      additionalProperties: {
        serializedName: "additionalProperties",
        type: {
          name: "Object"
        }
      }
    }
  }
};

export const EventsResultDataCustomDimensions = {
  serializedName: "eventsResultData_customDimensions",
  type: {
    name: "Composite",
    className: "EventsResultDataCustomDimensions",
    modelProperties: {
      additionalProperties: {
        serializedName: "additionalProperties",
        type: {
          name: "Object"
        }
      }
    }
  }
};

export const EventsResultDataCustomMeasurements = {
  serializedName: "eventsResultData_customMeasurements",
  type: {
    name: "Composite",
    className: "EventsResultDataCustomMeasurements",
    modelProperties: {
      additionalProperties: {
        serializedName: "additionalProperties",
        type: {
          name: "Object"
        }
      }
    }
  }
};

export const EventsOperationInfo = {
  serializedName: "eventsOperationInfo",
  type: {
    name: "Composite",
    className: "EventsOperationInfo",
    modelProperties: {
      name: {
        serializedName: "name",
        type: {
          name: "String"
        }
      },
      id: {
        serializedName: "id",
        type: {
          name: "String"
        }
      },
      parentId: {
        serializedName: "parentId",
        type: {
          name: "String"
        }
      },
      syntheticSource: {
        serializedName: "syntheticSource",
        type: {
          name: "String"
        }
      }
    }
  }
};

export const EventsSessionInfo = {
  serializedName: "eventsSessionInfo",
  type: {
    name: "Composite",
    className: "EventsSessionInfo",
    modelProperties: {
      id: {
        serializedName: "id",
        type: {
          name: "String"
        }
      }
    }
  }
};

export const EventsUserInfo = {
  serializedName: "eventsUserInfo",
  type: {
    name: "Composite",
    className: "EventsUserInfo",
    modelProperties: {
      id: {
        serializedName: "id",
        type: {
          name: "String"
        }
      },
      accountId: {
        serializedName: "accountId",
        type: {
          name: "String"
        }
      },
      authenticatedId: {
        serializedName: "authenticatedId",
        type: {
          name: "String"
        }
      }
    }
  }
};

export const EventsCloudInfo = {
  serializedName: "eventsCloudInfo",
  type: {
    name: "Composite",
    className: "EventsCloudInfo",
    modelProperties: {
      roleName: {
        serializedName: "roleName",
        type: {
          name: "String"
        }
      },
      roleInstance: {
        serializedName: "roleInstance",
        type: {
          name: "String"
        }
      }
    }
  }
};

export const EventsAiInfo = {
  serializedName: "eventsAiInfo",
  type: {
    name: "Composite",
    className: "EventsAiInfo",
    modelProperties: {
      iKey: {
        serializedName: "iKey",
        type: {
          name: "String"
        }
      },
      appName: {
        serializedName: "appName",
        type: {
          name: "String"
        }
      },
      appId: {
        serializedName: "appId",
        type: {
          name: "String"
        }
      },
      sdkVersion: {
        serializedName: "sdkVersion",
        type: {
          name: "String"
        }
      }
    }
  }
};

export const EventsApplicationInfo = {
  serializedName: "eventsApplicationInfo",
  type: {
    name: "Composite",
    className: "EventsApplicationInfo",
    modelProperties: {
      version: {
        serializedName: "version",
        type: {
          name: "String"
        }
      }
    }
  }
};

export const EventsClientInfo = {
  serializedName: "eventsClientInfo",
  type: {
    name: "Composite",
    className: "EventsClientInfo",
    modelProperties: {
      model: {
        serializedName: "model",
        type: {
          name: "String"
        }
      },
      os: {
        serializedName: "os",
        type: {
          name: "String"
        }
      },
      type: {
        serializedName: "type",
        type: {
          name: "String"
        }
      },
      browser: {
        serializedName: "browser",
        type: {
          name: "String"
        }
      },
      ip: {
        serializedName: "ip",
        type: {
          name: "String"
        }
      },
      city: {
        serializedName: "city",
        type: {
          name: "String"
        }
      },
      stateOrProvince: {
        serializedName: "stateOrProvince",
        type: {
          name: "String"
        }
      },
      countryOrRegion: {
        serializedName: "countryOrRegion",
        type: {
          name: "String"
        }
      }
    }
  }
};

export const EventsResultData = {
  serializedName: "eventsResultData",
  type: {
    name: "Composite",
    polymorphicDiscriminator: {
      serializedName: "type",
      clientName: "type"
    },
    uberParent: "EventsResultData",
    className: "EventsResultData",
    modelProperties: {
      id: {
        serializedName: "id",
        type: {
          name: "String"
        }
      },
      count: {
        serializedName: "count",
        type: {
          name: "Number"
        }
      },
      timestamp: {
        serializedName: "timestamp",
        type: {
          name: "DateTime"
        }
      },
      customDimensions: {
        serializedName: "customDimensions",
        type: {
          name: "Composite",
          className: "EventsResultDataCustomDimensions"
        }
      },
      customMeasurements: {
        serializedName: "customMeasurements",
        type: {
          name: "Composite",
          className: "EventsResultDataCustomMeasurements"
        }
      },
      operation: {
        serializedName: "operation",
        type: {
          name: "Composite",
          className: "EventsOperationInfo"
        }
      },
      session: {
        serializedName: "session",
        type: {
          name: "Composite",
          className: "EventsSessionInfo"
        }
      },
      user: {
        serializedName: "user",
        type: {
          name: "Composite",
          className: "EventsUserInfo"
        }
      },
      cloud: {
        serializedName: "cloud",
        type: {
          name: "Composite",
          className: "EventsCloudInfo"
        }
      },
      ai: {
        serializedName: "ai",
        type: {
          name: "Composite",
          className: "EventsAiInfo"
        }
      },
      application: {
        serializedName: "application",
        type: {
          name: "Composite",
          className: "EventsApplicationInfo"
        }
      },
      client: {
        serializedName: "client",
        type: {
          name: "Composite",
          className: "EventsClientInfo"
        }
      },
      type: {
        required: true,
        serializedName: "type",
        type: {
          name: "String"
        }
      }
    }
  }
};

export const EventsResults = {
  serializedName: "eventsResults",
  type: {
    name: "Composite",
    className: "EventsResults",
    modelProperties: {
      odatacontext: {
        serializedName: "@odata\\.context",
        type: {
          name: "String"
        }
      },
      aimessages: {
        serializedName: "@ai\\.messages",
        type: {
          name: "Sequence",
          element: {
            serializedName: "ErrorInfoElementType",
            type: {
              name: "Composite",
              className: "ErrorInfo"
            }
          }
        }
      },
      value: {
        serializedName: "value",
        type: {
          name: "Sequence",
          element: {
            serializedName: "EventsResultDataElementType",
            type: {
              name: "Composite",
              polymorphicDiscriminator: {
                serializedName: "type",
                clientName: "type"
              },
              uberParent: "EventsResultData",
              className: "EventsResultData"
            }
          }
        }
      }
    }
  }
};

export const EventsResult = {
  serializedName: "eventsResult",
  type: {
    name: "Composite",
    className: "EventsResult",
    modelProperties: {
      aimessages: {
        serializedName: "@ai\\.messages",
        type: {
          name: "Sequence",
          element: {
            serializedName: "ErrorInfoElementType",
            type: {
              name: "Composite",
              className: "ErrorInfo"
            }
          }
        }
      },
      value: {
        serializedName: "value",
        type: {
          name: "Composite",
          polymorphicDiscriminator: {
            serializedName: "type",
            clientName: "type"
          },
          uberParent: "EventsResultData",
          className: "EventsResultData"
        }
      }
    }
  }
};

export const EventsTraceInfo = {
  serializedName: "eventsTraceInfo",
  type: {
    name: "Composite",
    className: "EventsTraceInfo",
    modelProperties: {
      message: {
        serializedName: "message",
        type: {
          name: "String"
        }
      },
      severityLevel: {
        serializedName: "severityLevel",
        type: {
          name: "Number"
        }
      }
    }
  }
};

export const EventsTraceResult = {
  serializedName: "trace",
  type: {
    name: "Composite",
    className: "EventsTraceResult",
    modelProperties: {
      ...EventsResultData.type.modelProperties,
      trace: {
        serializedName: "trace",
        type: {
          name: "Composite",
          className: "EventsTraceInfo"
        }
      }
    }
  }
};

export const EventsCustomEventInfo = {
  serializedName: "eventsCustomEventInfo",
  type: {
    name: "Composite",
    className: "EventsCustomEventInfo",
    modelProperties: {
      name: {
        serializedName: "name",
        type: {
          name: "String"
        }
      }
    }
  }
};

export const EventsCustomEventResult = {
  serializedName: "customEvent",
  type: {
    name: "Composite",
    className: "EventsCustomEventResult",
    modelProperties: {
      ...EventsResultData.type.modelProperties,
      customEvent: {
        serializedName: "customEvent",
        type: {
          name: "Composite",
          className: "EventsCustomEventInfo"
        }
      }
    }
  }
};

export const EventsPageViewInfo = {
  serializedName: "eventsPageViewInfo",
  type: {
    name: "Composite",
    className: "EventsPageViewInfo",
    modelProperties: {
      name: {
        serializedName: "name",
        type: {
          name: "String"
        }
      },
      url: {
        serializedName: "url",
        type: {
          name: "String"
        }
      },
      duration: {
        serializedName: "duration",
        type: {
          name: "String"
        }
      },
      performanceBucket: {
        serializedName: "performanceBucket",
        type: {
          name: "String"
        }
      }
    }
  }
};

export const EventsPageViewResult = {
  serializedName: "pageView",
  type: {
    name: "Composite",
    className: "EventsPageViewResult",
    modelProperties: {
      ...EventsResultData.type.modelProperties,
      pageView: {
        serializedName: "pageView",
        type: {
          name: "Composite",
          className: "EventsPageViewInfo"
        }
      }
    }
  }
};

export const EventsBrowserTimingInfo = {
  serializedName: "eventsBrowserTimingInfo",
  type: {
    name: "Composite",
    className: "EventsBrowserTimingInfo",
    modelProperties: {
      urlPath: {
        serializedName: "urlPath",
        type: {
          name: "String"
        }
      },
      urlHost: {
        serializedName: "urlHost",
        type: {
          name: "String"
        }
      },
      name: {
        serializedName: "name",
        type: {
          name: "String"
        }
      },
      url: {
        serializedName: "url",
        type: {
          name: "String"
        }
      },
      totalDuration: {
        serializedName: "totalDuration",
        type: {
          name: "Number"
        }
      },
      performanceBucket: {
        serializedName: "performanceBucket",
        type: {
          name: "String"
        }
      },
      networkDuration: {
        serializedName: "networkDuration",
        type: {
          name: "Number"
        }
      },
      sendDuration: {
        serializedName: "sendDuration",
        type: {
          name: "Number"
        }
      },
      receiveDuration: {
        serializedName: "receiveDuration",
        type: {
          name: "Number"
        }
      },
      processingDuration: {
        serializedName: "processingDuration",
        type: {
          name: "Number"
        }
      }
    }
  }
};

export const EventsClientPerformanceInfo = {
  serializedName: "eventsClientPerformanceInfo",
  type: {
    name: "Composite",
    className: "EventsClientPerformanceInfo",
    modelProperties: {
      name: {
        serializedName: "name",
        type: {
          name: "String"
        }
      }
    }
  }
};

export const EventsBrowserTimingResult = {
  serializedName: "browserTiming",
  type: {
    name: "Composite",
    className: "EventsBrowserTimingResult",
    modelProperties: {
      ...EventsResultData.type.modelProperties,
      browserTiming: {
        serializedName: "browserTiming",
        type: {
          name: "Composite",
          className: "EventsBrowserTimingInfo"
        }
      },
      clientPerformance: {
        serializedName: "clientPerformance",
        type: {
          name: "Composite",
          className: "EventsClientPerformanceInfo"
        }
      }
    }
  }
};

export const EventsRequestInfo = {
  serializedName: "eventsRequestInfo",
  type: {
    name: "Composite",
    className: "EventsRequestInfo",
    modelProperties: {
      name: {
        serializedName: "name",
        type: {
          name: "String"
        }
      },
      url: {
        serializedName: "url",
        type: {
          name: "String"
        }
      },
      success: {
        serializedName: "success",
        type: {
          name: "String"
        }
      },
      duration: {
        serializedName: "duration",
        type: {
          name: "Number"
        }
      },
      performanceBucket: {
        serializedName: "performanceBucket",
        type: {
          name: "String"
        }
      },
      resultCode: {
        serializedName: "resultCode",
        type: {
          name: "String"
        }
      },
      source: {
        serializedName: "source",
        type: {
          name: "String"
        }
      },
      id: {
        serializedName: "id",
        type: {
          name: "String"
        }
      }
    }
  }
};

export const EventsRequestResult = {
  serializedName: "request",
  type: {
    name: "Composite",
    className: "EventsRequestResult",
    modelProperties: {
      ...EventsResultData.type.modelProperties,
      request: {
        serializedName: "request",
        type: {
          name: "Composite",
          className: "EventsRequestInfo"
        }
      }
    }
  }
};

export const EventsDependencyInfo = {
  serializedName: "eventsDependencyInfo",
  type: {
    name: "Composite",
    className: "EventsDependencyInfo",
    modelProperties: {
      target: {
        serializedName: "target",
        type: {
          name: "String"
        }
      },
      data: {
        serializedName: "data",
        type: {
          name: "String"
        }
      },
      success: {
        serializedName: "success",
        type: {
          name: "String"
        }
      },
      duration: {
        serializedName: "duration",
        type: {
          name: "Number"
        }
      },
      performanceBucket: {
        serializedName: "performanceBucket",
        type: {
          name: "String"
        }
      },
      resultCode: {
        serializedName: "resultCode",
        type: {
          name: "String"
        }
      },
      type: {
        serializedName: "type",
        type: {
          name: "String"
        }
      },
      name: {
        serializedName: "name",
        type: {
          name: "String"
        }
      },
      id: {
        serializedName: "id",
        type: {
          name: "String"
        }
      }
    }
  }
};

export const EventsDependencyResult = {
  serializedName: "dependency",
  type: {
    name: "Composite",
    className: "EventsDependencyResult",
    modelProperties: {
      ...EventsResultData.type.modelProperties,
      dependency: {
        serializedName: "dependency",
        type: {
          name: "Composite",
          className: "EventsDependencyInfo"
        }
      }
    }
  }
};

export const EventsExceptionDetailsParsedStack = {
  serializedName: "eventsExceptionDetailsParsedStack",
  type: {
    name: "Composite",
    className: "EventsExceptionDetailsParsedStack",
    modelProperties: {
      assembly: {
        serializedName: "assembly",
        type: {
          name: "String"
        }
      },
      method: {
        serializedName: "method",
        type: {
          name: "String"
        }
      },
      level: {
        serializedName: "level",
        type: {
          name: "Number"
        }
      },
      line: {
        serializedName: "line",
        type: {
          name: "Number"
        }
      }
    }
  }
};

export const EventsExceptionDetail = {
  serializedName: "eventsExceptionDetail",
  type: {
    name: "Composite",
    className: "EventsExceptionDetail",
    modelProperties: {
      severityLevel: {
        serializedName: "severityLevel",
        type: {
          name: "String"
        }
      },
      outerId: {
        serializedName: "outerId",
        type: {
          name: "String"
        }
      },
      message: {
        serializedName: "message",
        type: {
          name: "String"
        }
      },
      type: {
        serializedName: "type",
        type: {
          name: "String"
        }
      },
      id: {
        serializedName: "id",
        type: {
          name: "String"
        }
      },
      parsedStack: {
        serializedName: "parsedStack",
        type: {
          name: "Sequence",
          element: {
            serializedName: "EventsExceptionDetailsParsedStackElementType",
            type: {
              name: "Composite",
              className: "EventsExceptionDetailsParsedStack"
            }
          }
        }
      }
    }
  }
};

export const EventsExceptionInfo = {
  serializedName: "eventsExceptionInfo",
  type: {
    name: "Composite",
    className: "EventsExceptionInfo",
    modelProperties: {
      severityLevel: {
        serializedName: "severityLevel",
        type: {
          name: "Number"
        }
      },
      problemId: {
        serializedName: "problemId",
        type: {
          name: "String"
        }
      },
      handledAt: {
        serializedName: "handledAt",
        type: {
          name: "String"
        }
      },
      assembly: {
        serializedName: "assembly",
        type: {
          name: "String"
        }
      },
      method: {
        serializedName: "method",
        type: {
          name: "String"
        }
      },
      message: {
        serializedName: "message",
        type: {
          name: "String"
        }
      },
      type: {
        serializedName: "type",
        type: {
          name: "String"
        }
      },
      outerType: {
        serializedName: "outerType",
        type: {
          name: "String"
        }
      },
      outerMethod: {
        serializedName: "outerMethod",
        type: {
          name: "String"
        }
      },
      outerAssembly: {
        serializedName: "outerAssembly",
        type: {
          name: "String"
        }
      },
      outerMessage: {
        serializedName: "outerMessage",
        type: {
          name: "String"
        }
      },
      innermostType: {
        serializedName: "innermostType",
        type: {
          name: "String"
        }
      },
      innermostMessage: {
        serializedName: "innermostMessage",
        type: {
          name: "String"
        }
      },
      innermostMethod: {
        serializedName: "innermostMethod",
        type: {
          name: "String"
        }
      },
      innermostAssembly: {
        serializedName: "innermostAssembly",
        type: {
          name: "String"
        }
      },
      details: {
        serializedName: "details",
        type: {
          name: "Sequence",
          element: {
            serializedName: "EventsExceptionDetailElementType",
            type: {
              name: "Composite",
              className: "EventsExceptionDetail"
            }
          }
        }
      }
    }
  }
};

export const EventsExceptionResult = {
  serializedName: "exception",
  type: {
    name: "Composite",
    className: "EventsExceptionResult",
    modelProperties: {
      ...EventsResultData.type.modelProperties,
      exception: {
        serializedName: "exception",
        type: {
          name: "Composite",
          className: "EventsExceptionInfo"
        }
      }
    }
  }
};

export const EventsAvailabilityResultInfo = {
  serializedName: "eventsAvailabilityResultInfo",
  type: {
    name: "Composite",
    className: "EventsAvailabilityResultInfo",
    modelProperties: {
      name: {
        serializedName: "name",
        type: {
          name: "String"
        }
      },
      success: {
        serializedName: "success",
        type: {
          name: "String"
        }
      },
      duration: {
        serializedName: "duration",
        type: {
          name: "Number"
        }
      },
      performanceBucket: {
        serializedName: "performanceBucket",
        type: {
          name: "String"
        }
      },
      message: {
        serializedName: "message",
        type: {
          name: "String"
        }
      },
      location: {
        serializedName: "location",
        type: {
          name: "String"
        }
      },
      id: {
        serializedName: "id",
        type: {
          name: "String"
        }
      },
      size: {
        serializedName: "size",
        type: {
          name: "String"
        }
      }
    }
  }
};

export const EventsAvailabilityResultResult = {
  serializedName: "availabilityResult",
  type: {
    name: "Composite",
    className: "EventsAvailabilityResultResult",
    modelProperties: {
      ...EventsResultData.type.modelProperties,
      availabilityResult: {
        serializedName: "availabilityResult",
        type: {
          name: "Composite",
          className: "EventsAvailabilityResultInfo"
        }
      }
    }
  }
};

export const EventsPerformanceCounterInfo = {
  serializedName: "eventsPerformanceCounterInfo",
  type: {
    name: "Composite",
    className: "EventsPerformanceCounterInfo",
    modelProperties: {
      value: {
        serializedName: "value",
        type: {
          name: "Number"
        }
      },
      name: {
        serializedName: "name",
        type: {
          name: "String"
        }
      },
      category: {
        serializedName: "category",
        type: {
          name: "String"
        }
      },
      counter: {
        serializedName: "counter",
        type: {
          name: "String"
        }
      },
      instanceName: {
        serializedName: "instanceName",
        type: {
          name: "String"
        }
      },
      instance: {
        serializedName: "instance",
        type: {
          name: "String"
        }
      }
    }
  }
};

export const EventsPerformanceCounterResult = {
  serializedName: "performanceCounter",
  type: {
    name: "Composite",
    className: "EventsPerformanceCounterResult",
    modelProperties: {
      ...EventsResultData.type.modelProperties,
      performanceCounter: {
        serializedName: "performanceCounter",
        type: {
          name: "Composite",
          className: "EventsPerformanceCounterInfo"
        }
      }
    }
  }
};

export const EventsCustomMetricInfo = {
  serializedName: "eventsCustomMetricInfo",
  type: {
    name: "Composite",
    className: "EventsCustomMetricInfo",
    modelProperties: {
      name: {
        serializedName: "name",
        type: {
          name: "String"
        }
      },
      value: {
        serializedName: "value",
        type: {
          name: "Number"
        }
      },
      valueSum: {
        serializedName: "valueSum",
        type: {
          name: "Number"
        }
      },
      valueCount: {
        serializedName: "valueCount",
        type: {
          name: "Number"
        }
      },
      valueMin: {
        serializedName: "valueMin",
        type: {
          name: "Number"
        }
      },
      valueMax: {
        serializedName: "valueMax",
        type: {
          name: "Number"
        }
      },
      valueStdDev: {
        serializedName: "valueStdDev",
        type: {
          name: "Number"
        }
      }
    }
  }
};

export const EventsCustomMetricResult = {
  serializedName: "customMetric",
  type: {
    name: "Composite",
    className: "EventsCustomMetricResult",
    modelProperties: {
      ...EventsResultData.type.modelProperties,
      customMetric: {
        serializedName: "customMetric",
        type: {
          name: "Composite",
          className: "EventsCustomMetricInfo"
        }
      }
    }
  }
};

export const QueryBody = {
  serializedName: "queryBody",
  type: {
    name: "Composite",
    className: "QueryBody",
    modelProperties: {
      query: {
        required: true,
        serializedName: "query",
        type: {
          name: "String"
        }
      },
      timespan: {
        serializedName: "timespan",
        type: {
          name: "String"
        }
      },
      applications: {
        serializedName: "applications",
        type: {
          name: "Sequence",
          element: {
            serializedName: "stringElementType",
            type: {
              name: "String"
            }
          }
        }
      }
    }
  }
};

export const Column = {
  serializedName: "column",
  type: {
    name: "Composite",
    className: "Column",
    modelProperties: {
      name: {
        serializedName: "name",
        type: {
          name: "String"
        }
      },
      type: {
        serializedName: "type",
        type: {
          name: "String"
        }
      }
    }
  }
};

export const Table = {
  serializedName: "table",
  type: {
    name: "Composite",
    className: "Table",
    modelProperties: {
      name: {
        required: true,
        serializedName: "name",
        type: {
          name: "String"
        }
      },
      columns: {
        required: true,
        serializedName: "columns",
        type: {
          name: "Sequence",
          element: {
            serializedName: "ColumnElementType",
            type: {
              name: "Composite",
              className: "Column"
            }
          }
        }
      },
      rows: {
        required: true,
        serializedName: "rows",
        type: {
          name: "Sequence",
          element: {
            serializedName: "ArrayElementType",
            type: {
              name: "Sequence",
              element: {
                serializedName: "stringElementType",
                type: {
                  name: "String"
                }
              }
            }
          }
        }
      }
    }
  }
};

export const QueryResults = {
  serializedName: "queryResults",
  type: {
    name: "Composite",
    className: "QueryResults",
    modelProperties: {
      tables: {
        required: true,
        serializedName: "tables",
        type: {
          name: "Sequence",
          element: {
            serializedName: "TableElementType",
            type: {
              name: "Composite",
              className: "Table"
            }
          }
        }
      }
    }
  }
};

export const ErrorResponse = {
  serializedName: "errorResponse",
  type: {
    name: "Composite",
    className: "ErrorResponse",
    modelProperties: {
      error: {
        required: true,
        serializedName: "error",
        type: {
          name: "Composite",
          className: "ErrorInfo"
        }
      }
    }
  }
};

export const MetricsGetOptionalParams = {
  serializedName: "GetOptions",
  type: {
    name: "Composite",
    className: "MetricsGetOptionalParams",
    modelProperties: {
      timespan: {
        serializedName: "timespan",
        type: {
          name: "String"
        }
      },
      interval: {
        serializedName: "interval",
        type: {
          name: "TimeSpan"
        }
      },
      aggregation: {
        serializedName: "aggregation",
        constraints: {
          MinItems: 1
        },
        type: {
          name: "Sequence",
          element: {
            serializedName: "MetricsAggregationElementType",
            type: {
              name: "Enum",
              allowedValues: [
                "min",
                "max",
                "avg",
                "sum",
                "count",
                "unique"
              ]
            }
          }
        }
      },
      segment: {
        serializedName: "segment",
        constraints: {
          MinItems: 1
        },
        type: {
          name: "Sequence",
          element: {
            serializedName: "MetricsSegmentElementType",
            type: {
              name: "String"
            }
          }
        }
      },
      top: {
        serializedName: "top",
        type: {
          name: "Number"
        }
      },
      orderby: {
        serializedName: "orderby",
        type: {
          name: "String"
        }
      },
      filter: {
        serializedName: "filter",
        type: {
          name: "String"
        }
      }
    }
  }
};

export const EventsGetByTypeOptionalParams = {
  serializedName: "GetByTypeOptions",
  type: {
    name: "Composite",
    className: "EventsGetByTypeOptionalParams",
    modelProperties: {
      timespan: {
        serializedName: "timespan",
        type: {
          name: "String"
        }
      },
      filter: {
        serializedName: "$filter",
        type: {
          name: "String"
        }
      },
      search: {
        serializedName: "$search",
        type: {
          name: "String"
        }
      },
      orderby: {
        serializedName: "$orderby",
        type: {
          name: "String"
        }
      },
      select: {
        serializedName: "$select",
        type: {
          name: "String"
        }
      },
      skip: {
        serializedName: "$skip",
        type: {
          name: "Number"
        }
      },
      top: {
        serializedName: "$top",
        type: {
          name: "Number"
        }
      },
      format: {
        serializedName: "$format",
        type: {
          name: "String"
        }
      },
      count: {
        serializedName: "$count",
        type: {
          name: "Boolean"
        }
      },
      apply: {
        serializedName: "$apply",
        type: {
          name: "String"
        }
      }
    }
  }
};

export const EventsGetOptionalParams = {
  serializedName: "GetOptions",
  type: {
    name: "Composite",
    className: "EventsGetOptionalParams",
    modelProperties: {
      timespan: {
        serializedName: "timespan",
        type: {
          name: "String"
        }
      }
    }
  }
};

export const discriminators = {
  'eventsResultData' : EventsResultData,
  'EventsResultData.trace' : EventsTraceResult,
  'EventsResultData.customEvent' : EventsCustomEventResult,
  'EventsResultData.pageView' : EventsPageViewResult,
  'EventsResultData.browserTiming' : EventsBrowserTimingResult,
  'EventsResultData.request' : EventsRequestResult,
  'EventsResultData.dependency' : EventsDependencyResult,
  'EventsResultData.exception' : EventsExceptionResult,
  'EventsResultData.availabilityResult' : EventsAvailabilityResultResult,
  'EventsResultData.performanceCounter' : EventsPerformanceCounterResult,
  'EventsResultData.customMetric' : EventsCustomMetricResult
};
