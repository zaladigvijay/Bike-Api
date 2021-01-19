class ApiFilters{

    constructor(query, querystr) {
        this.query = query;
        this.querystr = querystr;
    }
    filter() {
        //this.query = this.query.find(this.querystr)
        let querstr = { ...this.querystr }
        const removeField = ['sort','fields','q','limit','page','sortbylike'];
        removeField.forEach(el => delete querstr[el]);
        querstr = JSON.stringify(querstr)
        querstr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)
        this.query=this.query.find(JSON.parse(querstr))
        return this
    }
    sort() {
        if (this.querystr.sort) {
            const sortBy = this.querystr.sort.split(',').join(' ');
            this.query=this.query.sort(sortBy)
        }
        return this;
    }

    limitFields() {

        if (this.querystr.fields) {
            const fields = this.querystr.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        }
        else {
            this.query = this.query.select('-__v');
        }
        return this
    }
    searchByQuery() {
        if (this.querystr.q) {
            const q = this.querystr.q.split(',').join(' ');
            this.query = this.query.find({$text: { $search: "\"" + q + "\"" }})
        }
        return this
    }
    pagination() {
        const page = parseInt(this.querystr.page) || 1
        const limit = parseInt(this.querystr.limit) || 10
        const skipresults = (page - 1) * limit
        this.query = this.query.skip(skipresults).limit(limit)
        return this
    }
   
}

module.exports=ApiFilters