import { ApiError } from "../utils/APIError";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const OBJECT_ID = /^[a-f\d]{24}$/i;

function checkField(name, rule, raw) {
    const isEmpty = raw === undefined || raw === '';

    if (isEmpty) {
        if (rule.required) return { error: `${name} is required` };
        if (rule.default !== undefined) return { value: rule.default };
        return { skip: true };
    }

    const type = rule.type || 'string';
    let value = raw;

    if (type === 'string' || type === 'email' || type === 'objectId') {
        if (typeof value !== 'string') return { error: `${name} must be text` };
    }
}