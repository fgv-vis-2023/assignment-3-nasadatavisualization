// only relevant quantitative data
var bar_vars = ['Absolute Magnitude', 'Est Dia in KM(min)', 'Est Dia in KM(max)', 'Relative Velocity km per sec', 'Miss Dist.(kilometers)', 'Minimum Orbit Intersection', 'Jupiter Tisserand Invariant', 'Eccentricity', 'Semi Major Axis', 'Inclination', 'Asc Node Longitude', 'Orbital Period', 'Perihelion Distance', 'Perihelion Arg', 'Aphelion Dist', 'Mean Anomaly', 'Mean Motion']

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
            .data(bar_vars)
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
            .range([0, 316-30]); // Offset to account for text
        

        const sidebar = d3.select("#sideBarPlotGroup")

        // Erase previous Side Bar plot
        sidebar.selectAll('rect').remove()
        sidebar.selectAll('text').remove()

        // Create Side Bar Plot
        sidebar.selectAll('rect')
            .data(data)
            .enter()
            .append('rect')
                .attr('x', 15 )
                .attr('y', (d, i) => 50 + i * 20 )
                .attr('width', d => columnScale(d[column]))
                .attr('height', 18)
                .attr('fill', d => d["Hazardous"] == "True" ? '#c1121f' : '#003459')
            .append('title')
                .text(d => "ID: " + d["Name"] + " Valor: " + d[column]);
        
        // Crete Side Bar Plot Title
        d3.select("#sideBarTitle")
            .text(column);

        sidebar.append('g')
            .attr("class", "value-label")
            .selectAll('text')
            .data(data)
            .enter()
            .append('text')
                .attr('x', d => columnScale(d[column])+18)
                .attr('y', (d, i) => i*20+64)
                .text(d => Math.round(d[column]*100)/100)
                .attr('fill', 'Gray');

        sidebar.append('g')
            .attr("class", "id-label")
            .selectAll('text')
            .data(data)
            .enter()
            .append('text')
                .attr('x', 18)
                .attr('y', (d, i) => i*20+64)
                .text(d => "ID: " + d["Name"])
                .attr('fill', 'white');
    })
    }

    // Create Event Listeners

    // Meteor Dropdown
    d3.select("#meteors").on("change", function() {
        // set title
        d3.select("#titleOv").text(
            "Meteor: " + d3.select("#meteors").node().value.toUpperCase()
        )

        // set body text
        d3.csv("nasa.csv", function(data) {
            data = data.filter(d => d.Name == d3.select("#meteors").node().value)
            d3.select("#body1Ov").text(
                "Absolute Magnitude: " + data[0]["Absolute Magnitude"]
            )
            d3.select("#body2Ov").text(
                "Relative Velocity: " + data[0]["Relative Velocity km per sec"].slice(0, 5) + " km/s"
            )
            d3.select("#body3Ov").text(
                "Hazerdous: " + data[0]["Hazardous"]
            )
            d3.select("#body4Ov").text(
                "Miss Distance: " + data[0]["Miss Dist.(Astronomical)"].slice(0, 5) + " AU"
            )
            d3.select("#body5Ov").text(
                "Orbit Uncertainity: " + data[0]["Orbit Uncertainity"]
            )
        })

    })

    // Column Dropdown
    d3.select("#columns").on("change", function() {
        column = d3.select("#columns").node().value;
        loadData();
    })

    // Search Button
    d3.select("#searchButton").on("click", function() {
        if (d3.select("#meteors").node().value == "") {
            alert("Please select a meteor from the dropdown menu.")
            return;
        }
        window.open("https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=" + d3.select("#meteors").node().value);
    })

    loadData();