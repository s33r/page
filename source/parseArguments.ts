import path from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

export type Arguments = {
    directory: string[],
    type: string,
    output: string,
    include: string[] | null,
    exclude: string[] | null,
    stat: boolean,
}

export default function parseArguments(args: string[]) : Arguments {
    const parsed = yargs(hideBin(args))
        .usage('Gathers stats from you files')
        .version('Version 1')

        .string('d')
        .array('d')
        .alias('d', 'directory')
        .describe('d', 'The directory to gather stats from')
        .default('d', process.cwd())
        .coerce('d', function(arg) :string[] {
            return arg;
        })

        .string('t')
        .alias('t', 'type')
        .describe('t', 'The output type')
        .default('t', 'text')
        .choices('t', ['text'])

        .string('o')
        .alias('o', 'output')
        .describe('o', 'The location to output the results')
        .default('o', process.cwd())

        .string('n')
        .alias('n', 'name')
        .describe('n', 'The name of the file to create (without extension)')
        .default('n', 'results')

        .boolean('s')
        .alias('s', 'stat')
        .describe('s', 'Stat each file (takes much longer)')
        .default('s', false)

        .string('i')
        .array('i')
        .alias('i', 'include')
        .describe('i', 'The tags to include')
        .conflicts('i', 'e')
        .coerce('i', function(arg) :string[] {
            return arg;
        })

        .string('e')
        .array('e')
        .alias('e', 'exclude')
        .describe('e', 'The tags to exclude')
        .conflicts('e', 'i')
        .coerce('e', function(arg) :string[] {
            return arg;
        })

        .help('h')
        .alias('h', 'help')

        .wrap(process.stdout.columns)
        .recommendCommands()
        .parseSync();

    const result = {
        directory: parsed.d!,
        type: parsed.t!.toLowerCase(),
        output: path.join(parsed.o, parsed.n),
        include: parsed.i || null,
        exclude: parsed.e || null,
        stat: parsed.s,
    };

    result.directory = result.directory.map(p => path.isAbsolute(p) ? p : path.resolve(process.cwd(), p));

    switch(result.type) {
        case 'text' :
        default:
            result.output = result.output + '.txt';
            break;
    }

    return result;
}