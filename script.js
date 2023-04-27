var column = "Absolute Magnitude"

    // define a function to load the data
    function loadData() {
    d3.csv("nasa.csv", function(data) {

        // Create Meteor Dropdown
        d3.select("#meteors")
            .selectAll("option")
            .data(data)
            .enter()
            .append("option")
            .text(function(d) {
                return d.Name;
            })
        
        // Create Column Dropdown
        d3.select("#columns")
            .selectAll("option")
            .data(data.columns)
            .enter()
            .append("option")
            .text(function(d) {
                return d;
            })

        // Sort Data
        data = data
            .sort((a, b) => b[column] - a[column])
            .slice(0, 19);

        // Create Column Scale
        var columnScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d[column])])
            .range([0, 316]);
        
        // Erase previous Side Bar plot
        d3.select("#sideBarPlotGroup").selectAll('rect').remove()

        // Create Side Bar Plot
        d3.select("#sideBarPlotGroup").selectAll('rect')
            .data(data)
            .enter()
            .append('rect')
            .attr('x', 15 )
            .attr('y', (d, i) => 50 + i * 20 )
            .attr('width', d => columnScale(d[column]))
            .attr('height', 18)
            .attr('fill', d => d["Hazardous"] == "True" ? '#c1121f' : '#003459')
        .append('title')
            .text(d => d["Name"]);
        
        // Crete Side Bar Plot Title
        d3.select("#sideBarTitle")
            .text(column);
    })
    }

    d3.select("#meteors").on("change", function() {
        d3.select("#search_text").text(
            "Meteor: " + d3.select("#meteors").node().value.toUpperCase()
        )
    })

    d3.select("#columns").on("change", function() {
        column = d3.select("#columns").node().value;
        loadData();
    })

    loadData();