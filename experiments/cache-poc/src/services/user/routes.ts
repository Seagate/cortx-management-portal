import { Request, Response, NextFunction } from "express";
import { CacheProvider } from '../cache/providers/cache_provider';

// API to get user.
export const getUser = (req: Request, res: Response) => {
    let id = req.query.id;
    let cache = new CacheProvider().getCache('memory-cache');

    if (cache.getData(id)) {
        let rows = cache.getData(id);
        res.setHeader("Content-Type", "application/json");
        res.send( rows );
    } else {
        setTimeout(() => {
            let rows = "{\"user\":{\"name\": \"Soniya\"}}";
            cache.setData(id, rows);
            res.setHeader("Content-Type", "application/json");
            res.send( rows );        
        }, 3000);
    }   
};