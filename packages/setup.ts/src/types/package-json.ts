import { z } from "zod";

const Person = z
  .object({
    name: z.string(),
    url: z.string().url(),
    email: z.string().email(),
  })
  .or(z.string())
  .describe(
    "A person who has been involved in creating or maintaining this package."
  );

const FundingUrl = z
  .string()
  .url()
  .describe("URL to a website with details about how to fund the package.");

const FundingWay = z
  .object({
    url: FundingUrl,
    type: z
      .string()
      .optional()
      .describe(
        "The type of funding or the platform through which funding can be provided, e.g. patreon, opencollective, tidelift or github."
      ),
  })
  .describe(
    "Used to inform about ways to help fund development of the package."
  );

const Dependency = z
  .object({})
  .optional()
  .describe(
    "Dependencies are specified with a simple hash of package name to version range. The version range is a string which has one or more space-separated descriptors. Dependencies can also be identified with a tarball or git URL."
  );

const PackageJsonSchema = z
  .object({
    name: z
      .string()
      .regex(
        new RegExp("^(?:@[a-z0-9-*~][a-z0-9-*._~]*/)?[a-z0-9-~][a-z0-9-._~]*$")
      )
      .describe("The name of the package."),
    version: z
      .string()
      .describe(
        "Version must be parsable by node-semver, which is bundled with npm as a dependency."
      ),
    description: z
      .string()
      .optional()
      .describe(
        "This helps people discover your package, as it's listed in 'npm search'."
      ),
    keywords: z
      .array(z.string())
      .optional()
      .describe(
        "This helps people discover your package as it's listed in 'npm search'."
      ),
    homepage: z
      .string()
      .url()
      .describe("The url to the project homepage.")
      .optional(),
    bugs: z
      .string()
      .or(
        z
          .object({
            url: z
              .string()
              .url()
              .describe("The url to your project's issue tracker."),
            email: z
              .string()
              .email()
              .describe(
                "The email address to which issues should be reported."
              ),
          })
          .partial()
      )
      .optional()
      .describe(
        "The url to your project's issue tracker and / or the email address to which issues should be reported. These are helpful for people who encounter issues with your package."
      ),
    license: z
      .string()
      .optional()
      .describe(
        "You should specify a license for your package so that people know how they are permitted to use it, and any restrictions you're placing on it."
      ),
    licenses: z
      .never()
      .optional()
      .describe(
        'DEPRECATED: Instead, use SPDX expressions, like this: { "license": "ISC" } or { "license": "(MIT OR Apache-2.0)" } see: \'https://docs.npmjs.com/files/package.json#license\'.'
      ),
    author: Person.optional(),
    contributors: z
      .array(Person)
      .optional()
      .describe("A list of people who contributed to this package."),
    maintainers: z
      .array(Person)
      .optional()
      .describe("A list of people who maintains this package."),
    files: z
      .array(z.string())
      .optional()
      .describe(
        "The 'files' field is an array of files to include in your project. If you name a folder in the array, then it will also include the files inside that folder."
      ),
    main: z
      .string()
      .optional()
      .describe(
        "The main field is a module ID that is the primary entry point to your program."
      ),
    exports: z
      .any()
      .optional()
      .describe(
        'The "exports" field is used to restrict external access to non-exported module files, also enables a module to import itself using "name".'
      ),
    bin: z
      .string()
      .or(z.object({}))
      .optional()
      .describe(
        'The "bin" field is a mapping of node.js script names to the files that should be used to execute them.'
      ),
    type: z
      .enum(["commonjs", "module"])
      .default("commonjs")
      .optional()
      .describe(
        'When set to "module", the type field allows a package to specify all .js files within are ES modules. If the "type" field is omitted or set to "commonjs", all .js files are treated as CommonJS.'
      ),
    types: z
      .string()
      .optional()
      .describe(
        "Set the types property to point to your bundled declaration file."
      ),
    typings: z
      .string()
      .optional()
      .describe(
        'Note that the "typings" field is synonymous with "types", and could be used as well.'
      ),
    typesVersions: z
      .object({})
      .optional()
      .describe(
        'The "typesVersions" field is used since TypeScript 3.1 to support features that were only made available in newer TypeScript versions.'
      ),
    man: z
      .array(z.string())
      .or(z.string())
      .optional()
      .describe(
        "Specify either a single file or an array of filenames to put in place for the man program to find."
      ),
    directories: z
      .object({
        bin: z
          .string()
          .describe(
            "If you specify a 'bin' directory, then all the files in that folder will be used as the 'bin' hash."
          ),
        doc: z
          .string()
          .describe(
            "Put markdown files in here. Eventually, these will be displayed nicely, maybe, someday."
          ),
        example: z
          .string()
          .describe(
            "Put example scripts in here. Someday, it might be exposed in some clever way."
          ),
        lib: z
          .string()
          .describe(
            "Tell people where the bulk of your library is. Nothing special is done with the lib folder in any way, but it's useful meta info."
          ),
        man: z
          .string()
          .describe(
            "A folder that is full of man pages. Sugar to generate a 'man' array by walking the folder."
          ),
        test: z.string(),
      })
      .partial()
      .optional(),
    repository: z
      .string()
      .or(
        z
          .object({
            type: z.string(),
            url: z.string(),
            directory: z.string(),
          })
          .partial()
      )
      .optional()
      .describe(
        "Specify the place where your code lives. This is helpful for people who want to contribute."
      ),
    funding: FundingUrl.or(FundingWay)
      .or(z.array(FundingUrl.or(FundingWay)).min(1))
      .optional()
      .describe(
        "Used to inform about ways to help fund development of the package."
      ),
    scripts: z
      .object({
        lint: z
          .string()
          .describe("Run code quality tools, e.g. ESLint, TSLint, etc."),
        prepublish: z
          .string()
          .describe(
            "Run BEFORE the package is published (Also run on local npm install without any arguments)."
          ),
        prepare: z
          .string()
          .describe(
            "Run both BEFORE the package is packed and published, and on local npm install without any arguments. This is run AFTER prepublish, but BEFORE prepublishOnly."
          ),
        prepublishOnly: z
          .string()
          .describe(
            "Run BEFORE the package is prepared and packed, ONLY on npm publish."
          ),
        prepack: z
          .string()
          .describe(
            "run BEFORE a tarball is packed (on npm pack, npm publish, and when installing git dependencies)."
          ),
        postpack: z
          .string()
          .describe(
            "Run AFTER the tarball has been generated and moved to its final destination."
          ),
        publish: z
          .string()
          .describe(
            "Publishes a package to the registry so that it can be installed by name. See https://docs.npmjs.com/cli/v8/commands/npm-publish"
          ),
        postpublish: z.string().describe("Run AFTER the package is published."),
        preinstall: z.string().describe("Run BEFORE the package is installed."),
        install: z.string().describe("Run AFTER the package is installed."),
        postinstall: z.string().describe("Run AFTER the package is installed."),
        preuninstall: z
          .string()
          .describe("Run BEFORE the package is uninstalled."),
        uninstall: z
          .string()
          .describe("Run BEFORE the package is uninstalled."),
        postuninstall: z
          .string()
          .describe("Run AFTER the package is uninstalled."),
        preversion: z.string().describe("Run BEFORE bump the package version."),
        version: z.string().describe("Run BEFORE bump the package version."),
        postversion: z.string().describe("Run AFTER bump the package version."),
        pretest: z.string().describe("Run BEFORE the 'npm test' command."),
        test: z.string().describe("Run by the 'npm test' command."),
        posttest: z.string().describe("Run AFTER the 'npm test' command."),
        prestop: z.string().describe("Run BEFORE the 'npm stop' command."),
        stop: z.string().describe("Run by the 'npm stop' command."),
        poststop: z.string().describe("Run AFTER the 'npm stop' command."),
        prestart: z.string().describe("Run BEFORE the 'npm start' command."),
        start: z.string().describe("Run by the 'npm start' command."),
        poststart: z.string().describe("Run AFTER the 'npm start' command."),
        prerestart: z
          .string()
          .describe(
            "Run BEFORE the 'npm restart' command. Note: 'npm restart' will run the stop and start scripts if no restart script is provided."
          ),
        restart: z
          .string()
          .describe(
            "Run by the 'npm restart' command. Note: 'npm restart' will run the stop and start scripts if no restart script is provided."
          ),
        postrestart: z
          .string()
          .describe(
            "Run AFTER the 'npm restart' command. Note: 'npm restart' will run the stop and start scripts if no restart script is provided."
          ),
        serve: z
          .string()
          .describe("Start dev server to serve application files"),
      })
      .partial()
      .passthrough()
      .default({})
      .optional()
      .describe(
        "The 'scripts' member is an object hash of script commands that are run at various times in the lifecycle of your package. The key is the lifecycle event, and the value is the command to run at that point."
      ),
    config: z
      .object({})
      .passthrough()
      .optional()
      .describe(
        "A 'config' hash can be used to set configuration parameters used in package scripts that persist across upgrades."
      ),
    dependencies: Dependency,
    devDependencies: Dependency,
    optionalDependencies: Dependency,
    peerDependencies: Dependency,
    peerDependenciesMeta: z
      .object({})
      .passthrough()
      .optional()
      .describe(
        'When a user installs your package, warnings are emitted if packages specified in "peerDependencies" are not already installed. The "peerDependenciesMeta" field serves to provide more information on how your peer dependencies are utilized. Most commonly, it allows peer dependencies to be marked as optional. Metadata for this field is specified with a simple hash of the package name to a metadata object.'
      ),
    bundledDependencies: z
      .array(z.string())
      .or(z.boolean())
      .optional()
      .describe(
        "Array of package names that will be bundled when publishing the package."
      ),
    bundleDependencies: z
      .never()
      .optional()
      .describe(
        'DEPRECATED: This field is honored, but "bundledDependencies" is the correct field name.'
      ),
    resolutions: z
      .object({})
      .passthrough()
      .optional()
      .describe(
        "Resolutions is used to support selective version resolutions, which lets you define custom package versions or ranges inside your dependencies. See: https://classic.yarnpkg.com/en/docs/selective-version-resolutions"
      ),
    packageManager: z
      .string()
      .regex(new RegExp("(npm|pnpm|yarn)@\\d+\\.\\d+\\.\\d+(-.+)?"))
      .optional(),
    engines: z
      .object({
        node: z
          .string()
          .regex(new RegExp("^(>=?|<=?)\\d+\\.\\d+\\.\\d+(-.+)?"))
          .optional(),
      })
      .partial()
      .passthrough()
      .optional()
      .describe(
        "Defines which package manager is expected to be used when working on the current project. This field is currently experimental and needs to be opted-in; see https://nodejs.org/api/corepack.html"
      ),
    engineStrict: z.boolean().optional(),
    os: z
      .array(z.string())
      .optional()
      .describe("Specify which operating systems your module will run on."),
    cpu: z
      .array(z.string())
      .optional()
      .describe(
        "Specify that your code only runs on certain cpu architectures."
      ),
    preferGlobal: z
      .boolean()
      .optional()
      .describe(
        "DEPRECATED: This option used to trigger an npm warning, but it will no longer warn. It is purely there for informational purposes. It is now recommended that you install any binaries as local devDependencies wherever possible."
      ),
    private: z
      .boolean()
      .or(z.enum(["true", "false"]))
      .optional(),
    publishConfig: z
      .object({
        access: z.enum(["public", "restricted"]).optional(),
        tag: z.string().optional(),
        registry: z.string().url().optional(),
      })
      .optional(),
    dist: z
      .object({
        shasum: z.string(),
        tarball: z.string(),
      })
      .partial()
      .optional(),
    readme: z.string().optional(),
    module: z
      .string()
      .optional()
      .describe(
        "An ECMAScript module ID that is the primary entry point to your program."
      ),
    esnext: z
      .string()
      .or(
        z
          .object({
            main: z.string(),
            browser: z.string(),
          })
          .partial()
      )
      .optional()
      .describe(
        "A module ID with untranspiled code that is the primary entry point to your program."
      ),
    workspace: z
      .array(z.string())
      .or(
        z
          .object({
            packages: z
              .array(z.string())
              .describe(
                "Workspace package paths. Glob patterns are supported."
              ),
            nohoist: z
              .array(z.string())
              .describe(
                "Packages to block from hoisting to the workspace root. Currently only supported in Yarn only."
              ),
          })
          .partial()
      )
      .optional()
      .describe(
        'Allows packages within a directory to depend on one another using direct linking of local files. Additionally, dependencies within a workspace are hoisted to the workspace root when possible to reduce duplication. Note: It\'s also a good idea to set "private" to true when using this feature.'
      ),
    eslintConfig: z
      .any()
      .optional()
      .describe(
        "A JSON object that is used to configure eslint. See: https://eslint.org/docs/user-guide/configuring"
      ),
    prettier: z
      .any()
      .optional()
      .describe(
        "A JSON object that is used to configure prettier. See: https://prettier.io/docs/en/configuration.html"
      ),
    ava: z
      .any()
      .optional()
      .describe(
        "A JSON object that is used to configure ava. See: https://github.com/avajs/ava"
      ),
    release: z
      .any()
      .optional()
      .describe("A JSON object that is used to configure semantic releases"),
  })
  .passthrough();

export type PackageJson = z.infer<typeof PackageJsonSchema>;

export function validate(evilData: unknown) {
  return PackageJsonSchema.safeParse(evilData);
}
