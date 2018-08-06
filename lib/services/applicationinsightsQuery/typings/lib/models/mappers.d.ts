export declare const CloudError: {
    required: boolean;
    serializedName: string;
    type: {
        name: string;
        className: string;
        modelProperties: {
            code: {
                required: boolean;
                serializedName: string;
                type: {
                    name: string;
                };
            };
            message: {
                required: boolean;
                serializedName: string;
                type: {
                    name: string;
                };
            };
            target: {
                required: boolean;
                serializedName: string;
                type: {
                    name: string;
                };
            };
            details: {
                required: boolean;
                serializedName: string;
                type: {
                    name: string;
                    element: {
                        required: boolean;
                        serializedName: string;
                        type: {
                            name: string;
                            className: string;
                        };
                    };
                };
            };
        };
    };
};
export declare const BaseResource: {
    required: boolean;
    serializedName: string;
    type: {
        name: string;
        className: string;
        modelProperties: {};
    };
};
export declare const MetricsPostBodySchemaParameters: {
    serializedName: string;
    type: {
        name: string;
        className: string;
        modelProperties: {
            metricId: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            timespan: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            aggregation: {
                serializedName: string;
                type: {
                    name: string;
                    element: {
                        serializedName: string;
                        type: {
                            name: string;
                            allowedValues: string[];
                        };
                    };
                };
            };
            interval: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            segment: {
                serializedName: string;
                type: {
                    name: string;
                    element: {
                        serializedName: string;
                        type: {
                            name: string;
                        };
                    };
                };
            };
            top: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            orderby: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            filter: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
        };
    };
};
export declare const MetricsPostBodySchema: {
    serializedName: string;
    type: {
        name: string;
        className: string;
        modelProperties: {
            id: {
                required: boolean;
                serializedName: string;
                type: {
                    name: string;
                };
            };
            parameters: {
                required: boolean;
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
        };
    };
};
export declare const MetricsSegmentInfo: {
    serializedName: string;
    type: {
        name: string;
        className: string;
        modelProperties: {
            additionalProperties: {
                type: {
                    name: string;
                    value: {
                        serializedName: string;
                        type: {
                            name: string;
                        };
                    };
                };
            };
            start: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            end: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            segments: {
                serializedName: string;
                type: {
                    name: string;
                    element: {
                        serializedName: string;
                        type: {
                            name: string;
                            className: string;
                        };
                    };
                };
            };
        };
    };
};
export declare const MetricsResultInfo: {
    serializedName: string;
    type: {
        name: string;
        className: string;
        modelProperties: {
            additionalProperties: {
                type: {
                    name: string;
                    value: {
                        serializedName: string;
                        type: {
                            name: string;
                        };
                    };
                };
            };
            start: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            end: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            interval: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            segments: {
                serializedName: string;
                type: {
                    name: string;
                    element: {
                        serializedName: string;
                        type: {
                            name: string;
                            className: string;
                        };
                    };
                };
            };
        };
    };
};
export declare const MetricsResult: {
    serializedName: string;
    type: {
        name: string;
        className: string;
        modelProperties: {
            value: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
        };
    };
};
export declare const MetricsResultsItem: {
    serializedName: string;
    type: {
        name: string;
        className: string;
        modelProperties: {
            id: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            status: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            body: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
        };
    };
};
export declare const ErrorDetail: {
    serializedName: string;
    type: {
        name: string;
        className: string;
        modelProperties: {
            code: {
                required: boolean;
                serializedName: string;
                type: {
                    name: string;
                };
            };
            message: {
                required: boolean;
                serializedName: string;
                type: {
                    name: string;
                };
            };
            target: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            value: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            resources: {
                serializedName: string;
                type: {
                    name: string;
                    element: {
                        serializedName: string;
                        type: {
                            name: string;
                        };
                    };
                };
            };
            additionalProperties: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
        };
    };
};
export declare const ErrorInfo: {
    serializedName: string;
    type: {
        name: string;
        className: string;
        modelProperties: {
            code: {
                required: boolean;
                serializedName: string;
                type: {
                    name: string;
                };
            };
            message: {
                required: boolean;
                serializedName: string;
                type: {
                    name: string;
                };
            };
            details: {
                serializedName: string;
                type: {
                    name: string;
                    element: {
                        serializedName: string;
                        type: {
                            name: string;
                            className: string;
                        };
                    };
                };
            };
            innererror: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            additionalProperties: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
        };
    };
};
export declare const EventsResultDataCustomDimensions: {
    serializedName: string;
    type: {
        name: string;
        className: string;
        modelProperties: {
            additionalProperties: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
        };
    };
};
export declare const EventsResultDataCustomMeasurements: {
    serializedName: string;
    type: {
        name: string;
        className: string;
        modelProperties: {
            additionalProperties: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
        };
    };
};
export declare const EventsOperationInfo: {
    serializedName: string;
    type: {
        name: string;
        className: string;
        modelProperties: {
            name: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            id: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            parentId: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            syntheticSource: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
        };
    };
};
export declare const EventsSessionInfo: {
    serializedName: string;
    type: {
        name: string;
        className: string;
        modelProperties: {
            id: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
        };
    };
};
export declare const EventsUserInfo: {
    serializedName: string;
    type: {
        name: string;
        className: string;
        modelProperties: {
            id: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            accountId: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            authenticatedId: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
        };
    };
};
export declare const EventsCloudInfo: {
    serializedName: string;
    type: {
        name: string;
        className: string;
        modelProperties: {
            roleName: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            roleInstance: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
        };
    };
};
export declare const EventsAiInfo: {
    serializedName: string;
    type: {
        name: string;
        className: string;
        modelProperties: {
            iKey: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            appName: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            appId: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            sdkVersion: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
        };
    };
};
export declare const EventsApplicationInfo: {
    serializedName: string;
    type: {
        name: string;
        className: string;
        modelProperties: {
            version: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
        };
    };
};
export declare const EventsClientInfo: {
    serializedName: string;
    type: {
        name: string;
        className: string;
        modelProperties: {
            model: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            os: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            type: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            browser: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            ip: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            city: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            stateOrProvince: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            countryOrRegion: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
        };
    };
};
export declare const EventsResultData: {
    serializedName: string;
    type: {
        name: string;
        polymorphicDiscriminator: {
            serializedName: string;
            clientName: string;
        };
        uberParent: string;
        className: string;
        modelProperties: {
            id: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            count: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            timestamp: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            customDimensions: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            customMeasurements: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            operation: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            session: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            user: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            cloud: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            ai: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            application: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            client: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            type: {
                required: boolean;
                serializedName: string;
                type: {
                    name: string;
                };
            };
        };
    };
};
export declare const EventsResults: {
    serializedName: string;
    type: {
        name: string;
        className: string;
        modelProperties: {
            odatacontext: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            aimessages: {
                serializedName: string;
                type: {
                    name: string;
                    element: {
                        serializedName: string;
                        type: {
                            name: string;
                            className: string;
                        };
                    };
                };
            };
            value: {
                serializedName: string;
                type: {
                    name: string;
                    element: {
                        serializedName: string;
                        type: {
                            name: string;
                            polymorphicDiscriminator: {
                                serializedName: string;
                                clientName: string;
                            };
                            uberParent: string;
                            className: string;
                        };
                    };
                };
            };
        };
    };
};
export declare const EventsResult: {
    serializedName: string;
    type: {
        name: string;
        className: string;
        modelProperties: {
            aimessages: {
                serializedName: string;
                type: {
                    name: string;
                    element: {
                        serializedName: string;
                        type: {
                            name: string;
                            className: string;
                        };
                    };
                };
            };
            value: {
                serializedName: string;
                type: {
                    name: string;
                    polymorphicDiscriminator: {
                        serializedName: string;
                        clientName: string;
                    };
                    uberParent: string;
                    className: string;
                };
            };
        };
    };
};
export declare const EventsTraceInfo: {
    serializedName: string;
    type: {
        name: string;
        className: string;
        modelProperties: {
            message: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            severityLevel: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
        };
    };
};
export declare const EventsTraceResult: {
    serializedName: string;
    type: {
        name: string;
        className: string;
        modelProperties: {
            trace: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            id: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            count: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            timestamp: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            customDimensions: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            customMeasurements: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            operation: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            session: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            user: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            cloud: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            ai: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            application: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            client: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            type: {
                required: boolean;
                serializedName: string;
                type: {
                    name: string;
                };
            };
        };
    };
};
export declare const EventsCustomEventInfo: {
    serializedName: string;
    type: {
        name: string;
        className: string;
        modelProperties: {
            name: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
        };
    };
};
export declare const EventsCustomEventResult: {
    serializedName: string;
    type: {
        name: string;
        className: string;
        modelProperties: {
            customEvent: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            id: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            count: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            timestamp: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            customDimensions: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            customMeasurements: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            operation: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            session: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            user: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            cloud: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            ai: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            application: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            client: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            type: {
                required: boolean;
                serializedName: string;
                type: {
                    name: string;
                };
            };
        };
    };
};
export declare const EventsPageViewInfo: {
    serializedName: string;
    type: {
        name: string;
        className: string;
        modelProperties: {
            name: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            url: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            duration: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            performanceBucket: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
        };
    };
};
export declare const EventsPageViewResult: {
    serializedName: string;
    type: {
        name: string;
        className: string;
        modelProperties: {
            pageView: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            id: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            count: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            timestamp: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            customDimensions: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            customMeasurements: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            operation: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            session: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            user: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            cloud: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            ai: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            application: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            client: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            type: {
                required: boolean;
                serializedName: string;
                type: {
                    name: string;
                };
            };
        };
    };
};
export declare const EventsBrowserTimingInfo: {
    serializedName: string;
    type: {
        name: string;
        className: string;
        modelProperties: {
            urlPath: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            urlHost: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            name: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            url: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            totalDuration: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            performanceBucket: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            networkDuration: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            sendDuration: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            receiveDuration: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            processingDuration: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
        };
    };
};
export declare const EventsClientPerformanceInfo: {
    serializedName: string;
    type: {
        name: string;
        className: string;
        modelProperties: {
            name: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
        };
    };
};
export declare const EventsBrowserTimingResult: {
    serializedName: string;
    type: {
        name: string;
        className: string;
        modelProperties: {
            browserTiming: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            clientPerformance: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            id: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            count: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            timestamp: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            customDimensions: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            customMeasurements: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            operation: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            session: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            user: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            cloud: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            ai: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            application: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            client: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            type: {
                required: boolean;
                serializedName: string;
                type: {
                    name: string;
                };
            };
        };
    };
};
export declare const EventsRequestInfo: {
    serializedName: string;
    type: {
        name: string;
        className: string;
        modelProperties: {
            name: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            url: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            success: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            duration: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            performanceBucket: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            resultCode: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            source: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            id: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
        };
    };
};
export declare const EventsRequestResult: {
    serializedName: string;
    type: {
        name: string;
        className: string;
        modelProperties: {
            request: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            id: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            count: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            timestamp: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            customDimensions: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            customMeasurements: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            operation: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            session: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            user: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            cloud: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            ai: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            application: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            client: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            type: {
                required: boolean;
                serializedName: string;
                type: {
                    name: string;
                };
            };
        };
    };
};
export declare const EventsDependencyInfo: {
    serializedName: string;
    type: {
        name: string;
        className: string;
        modelProperties: {
            target: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            data: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            success: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            duration: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            performanceBucket: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            resultCode: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            type: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            name: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            id: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
        };
    };
};
export declare const EventsDependencyResult: {
    serializedName: string;
    type: {
        name: string;
        className: string;
        modelProperties: {
            dependency: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            id: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            count: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            timestamp: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            customDimensions: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            customMeasurements: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            operation: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            session: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            user: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            cloud: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            ai: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            application: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            client: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            type: {
                required: boolean;
                serializedName: string;
                type: {
                    name: string;
                };
            };
        };
    };
};
export declare const EventsExceptionDetailsParsedStack: {
    serializedName: string;
    type: {
        name: string;
        className: string;
        modelProperties: {
            assembly: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            method: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            level: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            line: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
        };
    };
};
export declare const EventsExceptionDetail: {
    serializedName: string;
    type: {
        name: string;
        className: string;
        modelProperties: {
            severityLevel: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            outerId: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            message: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            type: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            id: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            parsedStack: {
                serializedName: string;
                type: {
                    name: string;
                    element: {
                        serializedName: string;
                        type: {
                            name: string;
                            className: string;
                        };
                    };
                };
            };
        };
    };
};
export declare const EventsExceptionInfo: {
    serializedName: string;
    type: {
        name: string;
        className: string;
        modelProperties: {
            severityLevel: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            problemId: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            handledAt: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            assembly: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            method: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            message: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            type: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            outerType: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            outerMethod: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            outerAssembly: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            outerMessage: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            innermostType: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            innermostMessage: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            innermostMethod: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            innermostAssembly: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            details: {
                serializedName: string;
                type: {
                    name: string;
                    element: {
                        serializedName: string;
                        type: {
                            name: string;
                            className: string;
                        };
                    };
                };
            };
        };
    };
};
export declare const EventsExceptionResult: {
    serializedName: string;
    type: {
        name: string;
        className: string;
        modelProperties: {
            exception: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            id: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            count: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            timestamp: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            customDimensions: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            customMeasurements: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            operation: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            session: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            user: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            cloud: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            ai: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            application: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            client: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            type: {
                required: boolean;
                serializedName: string;
                type: {
                    name: string;
                };
            };
        };
    };
};
export declare const EventsAvailabilityResultInfo: {
    serializedName: string;
    type: {
        name: string;
        className: string;
        modelProperties: {
            name: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            success: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            duration: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            performanceBucket: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            message: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            location: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            id: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            size: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
        };
    };
};
export declare const EventsAvailabilityResultResult: {
    serializedName: string;
    type: {
        name: string;
        className: string;
        modelProperties: {
            availabilityResult: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            id: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            count: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            timestamp: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            customDimensions: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            customMeasurements: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            operation: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            session: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            user: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            cloud: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            ai: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            application: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            client: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            type: {
                required: boolean;
                serializedName: string;
                type: {
                    name: string;
                };
            };
        };
    };
};
export declare const EventsPerformanceCounterInfo: {
    serializedName: string;
    type: {
        name: string;
        className: string;
        modelProperties: {
            value: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            name: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            category: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            counter: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            instanceName: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            instance: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
        };
    };
};
export declare const EventsPerformanceCounterResult: {
    serializedName: string;
    type: {
        name: string;
        className: string;
        modelProperties: {
            performanceCounter: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            id: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            count: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            timestamp: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            customDimensions: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            customMeasurements: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            operation: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            session: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            user: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            cloud: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            ai: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            application: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            client: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            type: {
                required: boolean;
                serializedName: string;
                type: {
                    name: string;
                };
            };
        };
    };
};
export declare const EventsCustomMetricInfo: {
    serializedName: string;
    type: {
        name: string;
        className: string;
        modelProperties: {
            name: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            value: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            valueSum: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            valueCount: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            valueMin: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            valueMax: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            valueStdDev: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
        };
    };
};
export declare const EventsCustomMetricResult: {
    serializedName: string;
    type: {
        name: string;
        className: string;
        modelProperties: {
            customMetric: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            id: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            count: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            timestamp: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            customDimensions: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            customMeasurements: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            operation: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            session: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            user: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            cloud: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            ai: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            application: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            client: {
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
            type: {
                required: boolean;
                serializedName: string;
                type: {
                    name: string;
                };
            };
        };
    };
};
export declare const QueryBody: {
    serializedName: string;
    type: {
        name: string;
        className: string;
        modelProperties: {
            query: {
                required: boolean;
                serializedName: string;
                type: {
                    name: string;
                };
            };
            timespan: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            applications: {
                serializedName: string;
                type: {
                    name: string;
                    element: {
                        serializedName: string;
                        type: {
                            name: string;
                        };
                    };
                };
            };
        };
    };
};
export declare const Column: {
    serializedName: string;
    type: {
        name: string;
        className: string;
        modelProperties: {
            name: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            type: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
        };
    };
};
export declare const Table: {
    serializedName: string;
    type: {
        name: string;
        className: string;
        modelProperties: {
            name: {
                required: boolean;
                serializedName: string;
                type: {
                    name: string;
                };
            };
            columns: {
                required: boolean;
                serializedName: string;
                type: {
                    name: string;
                    element: {
                        serializedName: string;
                        type: {
                            name: string;
                            className: string;
                        };
                    };
                };
            };
            rows: {
                required: boolean;
                serializedName: string;
                type: {
                    name: string;
                    element: {
                        serializedName: string;
                        type: {
                            name: string;
                            element: {
                                serializedName: string;
                                type: {
                                    name: string;
                                };
                            };
                        };
                    };
                };
            };
        };
    };
};
export declare const QueryResults: {
    serializedName: string;
    type: {
        name: string;
        className: string;
        modelProperties: {
            tables: {
                required: boolean;
                serializedName: string;
                type: {
                    name: string;
                    element: {
                        serializedName: string;
                        type: {
                            name: string;
                            className: string;
                        };
                    };
                };
            };
        };
    };
};
export declare const ErrorResponse: {
    serializedName: string;
    type: {
        name: string;
        className: string;
        modelProperties: {
            error: {
                required: boolean;
                serializedName: string;
                type: {
                    name: string;
                    className: string;
                };
            };
        };
    };
};
export declare const MetricsGetOptionalParams: {
    serializedName: string;
    type: {
        name: string;
        className: string;
        modelProperties: {
            timespan: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            interval: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            aggregation: {
                serializedName: string;
                constraints: {
                    MinItems: number;
                };
                type: {
                    name: string;
                    element: {
                        serializedName: string;
                        type: {
                            name: string;
                            allowedValues: string[];
                        };
                    };
                };
            };
            segment: {
                serializedName: string;
                constraints: {
                    MinItems: number;
                };
                type: {
                    name: string;
                    element: {
                        serializedName: string;
                        type: {
                            name: string;
                        };
                    };
                };
            };
            top: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            orderby: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            filter: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
        };
    };
};
export declare const EventsGetByTypeOptionalParams: {
    serializedName: string;
    type: {
        name: string;
        className: string;
        modelProperties: {
            timespan: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            filter: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            search: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            orderby: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            select: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            skip: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            top: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            format: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            count: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
            apply: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
        };
    };
};
export declare const EventsGetOptionalParams: {
    serializedName: string;
    type: {
        name: string;
        className: string;
        modelProperties: {
            timespan: {
                serializedName: string;
                type: {
                    name: string;
                };
            };
        };
    };
};
export declare const discriminators: {
    'eventsResultData': {
        serializedName: string;
        type: {
            name: string;
            polymorphicDiscriminator: {
                serializedName: string;
                clientName: string;
            };
            uberParent: string;
            className: string;
            modelProperties: {
                id: {
                    serializedName: string;
                    type: {
                        name: string;
                    };
                };
                count: {
                    serializedName: string;
                    type: {
                        name: string;
                    };
                };
                timestamp: {
                    serializedName: string;
                    type: {
                        name: string;
                    };
                };
                customDimensions: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                customMeasurements: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                operation: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                session: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                user: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                cloud: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                ai: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                application: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                client: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                type: {
                    required: boolean;
                    serializedName: string;
                    type: {
                        name: string;
                    };
                };
            };
        };
    };
    'EventsResultData.trace': {
        serializedName: string;
        type: {
            name: string;
            className: string;
            modelProperties: {
                trace: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                id: {
                    serializedName: string;
                    type: {
                        name: string;
                    };
                };
                count: {
                    serializedName: string;
                    type: {
                        name: string;
                    };
                };
                timestamp: {
                    serializedName: string;
                    type: {
                        name: string;
                    };
                };
                customDimensions: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                customMeasurements: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                operation: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                session: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                user: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                cloud: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                ai: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                application: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                client: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                type: {
                    required: boolean;
                    serializedName: string;
                    type: {
                        name: string;
                    };
                };
            };
        };
    };
    'EventsResultData.customEvent': {
        serializedName: string;
        type: {
            name: string;
            className: string;
            modelProperties: {
                customEvent: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                id: {
                    serializedName: string;
                    type: {
                        name: string;
                    };
                };
                count: {
                    serializedName: string;
                    type: {
                        name: string;
                    };
                };
                timestamp: {
                    serializedName: string;
                    type: {
                        name: string;
                    };
                };
                customDimensions: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                customMeasurements: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                operation: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                session: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                user: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                cloud: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                ai: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                application: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                client: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                type: {
                    required: boolean;
                    serializedName: string;
                    type: {
                        name: string;
                    };
                };
            };
        };
    };
    'EventsResultData.pageView': {
        serializedName: string;
        type: {
            name: string;
            className: string;
            modelProperties: {
                pageView: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                id: {
                    serializedName: string;
                    type: {
                        name: string;
                    };
                };
                count: {
                    serializedName: string;
                    type: {
                        name: string;
                    };
                };
                timestamp: {
                    serializedName: string;
                    type: {
                        name: string;
                    };
                };
                customDimensions: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                customMeasurements: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                operation: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                session: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                user: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                cloud: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                ai: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                application: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                client: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                type: {
                    required: boolean;
                    serializedName: string;
                    type: {
                        name: string;
                    };
                };
            };
        };
    };
    'EventsResultData.browserTiming': {
        serializedName: string;
        type: {
            name: string;
            className: string;
            modelProperties: {
                browserTiming: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                clientPerformance: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                id: {
                    serializedName: string;
                    type: {
                        name: string;
                    };
                };
                count: {
                    serializedName: string;
                    type: {
                        name: string;
                    };
                };
                timestamp: {
                    serializedName: string;
                    type: {
                        name: string;
                    };
                };
                customDimensions: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                customMeasurements: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                operation: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                session: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                user: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                cloud: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                ai: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                application: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                client: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                type: {
                    required: boolean;
                    serializedName: string;
                    type: {
                        name: string;
                    };
                };
            };
        };
    };
    'EventsResultData.request': {
        serializedName: string;
        type: {
            name: string;
            className: string;
            modelProperties: {
                request: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                id: {
                    serializedName: string;
                    type: {
                        name: string;
                    };
                };
                count: {
                    serializedName: string;
                    type: {
                        name: string;
                    };
                };
                timestamp: {
                    serializedName: string;
                    type: {
                        name: string;
                    };
                };
                customDimensions: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                customMeasurements: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                operation: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                session: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                user: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                cloud: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                ai: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                application: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                client: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                type: {
                    required: boolean;
                    serializedName: string;
                    type: {
                        name: string;
                    };
                };
            };
        };
    };
    'EventsResultData.dependency': {
        serializedName: string;
        type: {
            name: string;
            className: string;
            modelProperties: {
                dependency: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                id: {
                    serializedName: string;
                    type: {
                        name: string;
                    };
                };
                count: {
                    serializedName: string;
                    type: {
                        name: string;
                    };
                };
                timestamp: {
                    serializedName: string;
                    type: {
                        name: string;
                    };
                };
                customDimensions: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                customMeasurements: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                operation: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                session: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                user: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                cloud: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                ai: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                application: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                client: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                type: {
                    required: boolean;
                    serializedName: string;
                    type: {
                        name: string;
                    };
                };
            };
        };
    };
    'EventsResultData.exception': {
        serializedName: string;
        type: {
            name: string;
            className: string;
            modelProperties: {
                exception: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                id: {
                    serializedName: string;
                    type: {
                        name: string;
                    };
                };
                count: {
                    serializedName: string;
                    type: {
                        name: string;
                    };
                };
                timestamp: {
                    serializedName: string;
                    type: {
                        name: string;
                    };
                };
                customDimensions: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                customMeasurements: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                operation: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                session: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                user: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                cloud: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                ai: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                application: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                client: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                type: {
                    required: boolean;
                    serializedName: string;
                    type: {
                        name: string;
                    };
                };
            };
        };
    };
    'EventsResultData.availabilityResult': {
        serializedName: string;
        type: {
            name: string;
            className: string;
            modelProperties: {
                availabilityResult: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                id: {
                    serializedName: string;
                    type: {
                        name: string;
                    };
                };
                count: {
                    serializedName: string;
                    type: {
                        name: string;
                    };
                };
                timestamp: {
                    serializedName: string;
                    type: {
                        name: string;
                    };
                };
                customDimensions: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                customMeasurements: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                operation: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                session: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                user: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                cloud: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                ai: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                application: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                client: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                type: {
                    required: boolean;
                    serializedName: string;
                    type: {
                        name: string;
                    };
                };
            };
        };
    };
    'EventsResultData.performanceCounter': {
        serializedName: string;
        type: {
            name: string;
            className: string;
            modelProperties: {
                performanceCounter: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                id: {
                    serializedName: string;
                    type: {
                        name: string;
                    };
                };
                count: {
                    serializedName: string;
                    type: {
                        name: string;
                    };
                };
                timestamp: {
                    serializedName: string;
                    type: {
                        name: string;
                    };
                };
                customDimensions: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                customMeasurements: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                operation: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                session: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                user: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                cloud: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                ai: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                application: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                client: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                type: {
                    required: boolean;
                    serializedName: string;
                    type: {
                        name: string;
                    };
                };
            };
        };
    };
    'EventsResultData.customMetric': {
        serializedName: string;
        type: {
            name: string;
            className: string;
            modelProperties: {
                customMetric: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                id: {
                    serializedName: string;
                    type: {
                        name: string;
                    };
                };
                count: {
                    serializedName: string;
                    type: {
                        name: string;
                    };
                };
                timestamp: {
                    serializedName: string;
                    type: {
                        name: string;
                    };
                };
                customDimensions: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                customMeasurements: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                operation: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                session: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                user: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                cloud: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                ai: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                application: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                client: {
                    serializedName: string;
                    type: {
                        name: string;
                        className: string;
                    };
                };
                type: {
                    required: boolean;
                    serializedName: string;
                    type: {
                        name: string;
                    };
                };
            };
        };
    };
};
