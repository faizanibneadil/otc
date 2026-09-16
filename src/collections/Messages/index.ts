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
        name: "message"
    }, {
        type: "relationship",
        relationTo: "users",
        name: "message_by"
    }, {
        type: "relationship",
        relationTo: "rooms",
        name: "room"
    }]
}