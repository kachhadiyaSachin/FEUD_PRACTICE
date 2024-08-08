import { userExample } from "./user.controller";
import { feudsExample } from "./feuds.controller";
import { profileExample } from "./profile.controller";

export default {
    userExample : new userExample(),
    feudsExample : new feudsExample(),
    profileExample : new profileExample()
};
