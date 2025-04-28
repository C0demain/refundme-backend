export default function parseSearch(search: string | undefined, attributes: string[]){
    if(!search || !search.trim()){
        return {}
    }

    return {
        $or: attributes.map((attr) => {return {[attr]: {$regex : search, $options: 'i'} } })
    }
}