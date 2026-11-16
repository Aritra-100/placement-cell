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
    else if (type === 'number') {
        value = typeof value === 'string' ? Number(value) : value;
        if (typeof value !== 'number' || !Number.isFinite(value)) {
            return { error: `${name} must be a number` };
        }
        if (rule.min !== undefined && value < rule.min) return { error: `${name} must be at least ${rule.min}` };
        if (rule.max !== undefined && value > rule.max) return { error: `${name} must be at most ${rule.max}` };
    }
    else if (type === 'boolean') {
        if (value === 'true') value = true;
        else if (value === 'false') value = false;
        if (typeof value !== 'boolean') return { error: `${name} must be true or false` };
    }
    else if (type === 'date') {
        const d = new Date(value);
        if (Number.isNaN(d.getTime())) return { error: `${name} must be a valid date` };
        value = d;
    }
    else if (type === 'array') {
        if (!Array.isArray(value)) return { error: `${name} must be a list` };
        if (rule.maxItems && value.length > rule.maxItems) {
            return { error: `${name} can have atmost ${maxItems} items` };
        }
        const cleaned = [];
        for (const item of value) {
            const r = checkField(`${name} item`, { type: rule.items || 'string', required: true, maxLength: rule.itemMaxLength }, item);
            if (r.error) return { error: r.error };
            cleaned.push(r.value);
        }
        value = cleaned;
    }
    else {
        throw new Error(`Unknown validation type: ${type}`);
    }
    if (rule.enum && !rule.enum.includes(value)) {
        return { error: `${name} must be one of: ${rule.enum.join(', ')}` };
    }

    return { value };
}