// lib/utils/validate/reduce.ts
// Function to reduce an object

/**
 * Reduces the given keys and values into a new object of type Type.
 * @template Type The type of the resulting object.
 * @param keys The keys to reduce.
 * @param values The values to reduce.
 * @returns A new object of type Type containing the reduced keys and values.
 */
export default function reduce<Type extends Record<PropertyKey, unknown>>(keys: Array<keyof Type>, values: unknown) {
    return keys.reduce((acc, k) => {
        const key = k as keyof Type;
        const incoming = (values as Partial<Type>)[key];
        if (incoming !== undefined)
            acc[key] = incoming as Type[typeof key];
        return acc;
    }, {} as Record<keyof Type, Type[keyof Type]>) as Type;
}