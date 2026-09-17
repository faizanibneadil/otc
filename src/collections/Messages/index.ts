import { CollectionConfig } from "payload";

export const Messages: CollectionConfig<'messages'> = {
    slug: "messages",
    access: {
        create: () => true,
        read: () => true,
        delete: () => true,
        update: () => true
    },
    fields: [{
        type: "text",
        name: "message",
        required: true // empty message create na ho, ye bhi add kr diya
    }, {
        // pehle ye 'users' collection ka relationship tha (auth-based)
        // ab authentication nahi he isliye sirf jo naam user ne khud diya
        // wo yahan plain text ki tarah save hoga, koi login/user record nahi banega
        type: "text",
        name: "message_by",
        required: true
    }, {
        type: "relationship",
        relationTo: "rooms",
        name: "room",
        required: true
    }]
}