import path, { dirname} from 'path'
import { fileURLToPath } from 'url' 
import fse from 'fs-extra'

const __dirname = dirname(fileURLToPath(import.meta.url))

fse.emptyDirSync(path.join(process.cwd(), 'lib'))

export default {
    input: path.join(__dirname, 'src/index.js'),
    output: {
        file: path.join(__dirname, 'lib/index.js'),
        format: 'es',
        sourceMap: true
    }
}