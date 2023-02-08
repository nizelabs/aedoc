import invariant from "npm:tiny-invariant@^1.3.1";
import { parse } from "https://deno.land/std@0.177.0/flags/mod.ts";

const { changed, deleted, branch, pat } = parse(Deno.args, {
	default: {
		branch: "main",
	},
	stopEarly: true,
	string: ["changed", "deleted", "branch", "pat"],
});

invariant(changed, `"changed" argument is required`);
invariant(deleted, '"deleted" argument is required');
invariant(pat, '"pat" argument is required');

// send workflow dispatch request via github api
const response = await fetch(
	`https://api.github.com/repos/nizelabs/aedoc/actions/workflows/api-sync`,
	{
		body: JSON.stringify({
			ref: branch,
			inputs: {
				changed: JSON.parse(changed),
				deleted: JSON.parse(deleted),
			},
		}),
		headers: {
			accept: "application/vnd.github+json",
			authorization: `Bearer ${pat}`,
			"x-github-api-version": "2022-11-28",
		},
		method: "POST",
	}
);

if (response.status >= 400) throw new Error(await response.json());
