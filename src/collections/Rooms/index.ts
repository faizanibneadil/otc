import { CollectionConfig } from "payload";

export const Rooms: CollectionConfig<'rooms'> = {
    slug: "rooms",
    access: {
        create: () => true,
        update: () => true,
        delete: () => true,
        read: () => true
    },
    fields: [{
        type: "text",
        name: "title",
        label: "Room Title"
    }, {
        type: "textarea",
        name: "description",
        label: "Room Description"
    }]
}