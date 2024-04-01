import { TypedPocketBase, UserResponse } from "./pocketbase-types"

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
            pb: TypedPocketBase,
			user: UserResponse
        }
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
