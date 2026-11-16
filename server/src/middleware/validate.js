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
        value = value.trim();
        if (type === 'email') {
            value = value.toLowerCase();
            if (!EMAIL.test(value)) return { error: `${name} must be a valid email` };
        }
        if (type === 'objectId' && !OBJECT_ID.test(value)) {
            return { error: `${name} must be a valid id` };
        }
        if (rule.minLength && value.length < rule.minLength) {
            return { error: `${name} must be at least ${rule.minLength} characters` };
        }
        if (rule.maxLength && value.length > rule.maxLength) {
            return { error: `${name} must be at most ${rule.maxLength} characters` };
        }
        if (rule.pattern && !rule.pattern.test(value)) {
            return { error: rule.patternMessage || `${name} has an invalid format` };
        }
    }
}