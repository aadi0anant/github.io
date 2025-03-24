/**
File: responseCodes.ts
Author: Ritik Sharma(100952840), Brendan Obilo(100952871)
Date: 2025-02-23
Description: This is the responseCodes javascript file that contains the response codes for the error handling in the application.
*/

"use strict";

interface ResponseCodes{
    SUCCESS: number,
    BAD_REQUEST: number,
    UNAUTHORIZED: number,
    FORBIDDEN: number,
    NOT_FOUND: number,
    DUPLICATE: number,
    INTERNAL_SERVER_ERROR: number
}
// To export error response codes for easy accessibility
export const responseCodes:ResponseCodes = {
    SUCCESS: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    DUPLICATE: 409,
    INTERNAL_SERVER_ERROR: 500
};


