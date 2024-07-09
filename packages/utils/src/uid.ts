import { v4 as uuidv4 } from 'uuid';

export function generateUID(): string {
    return uuidv4().replace(/-/g, '');
}
