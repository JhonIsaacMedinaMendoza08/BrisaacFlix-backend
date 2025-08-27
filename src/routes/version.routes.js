// imports
import { Router } from "express";
import semver from 'semver';

const router = Router();


//configuración versión
const apiVersion = process.env.API_VERSION;
const rangeMin = `>=${apiVersion}`

router.get('/', (req, res) => {
    const ver = req.query.ver;

    if (!ver) {
        return res.status(400).json({ error: "A valid version is necesary in query params! 🥸" })
    }

    const parsedVer = semver.coerce(ver)?.version;

    if (!parsedVer || !semver.valid(parsedVer)) {
        return res.status(400).json({
            error: "Invalid version has been provided!",
            version: ver,
            validExample: "1.0.0"
        })
    }

    const versionMinResponse = semver.satisfies(parsedVer, rangeMin);

    if (versionMinResponse) {
        return res.status(200).json({
            response: "The version is correct!!",
            version: parsedVer,
            versionMin: rangeMin
        })
    }

    if (versionMinResponse) {
        return res.status(200).json({
            response: "The version is correct!!",
            version: parsedVer,
            versionMin: rangeMin
        })
    }

    return res.status(426).json({
        response: "The version isn't correct, You need an upgrade!!",
        version: parsedVer,
        versionMin: rangeMin,
    })
});

export default router;