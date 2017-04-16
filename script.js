var Nightmare = require("nightmare");
var nightmare = Nightmare({show: false});

var url = "https://mlh.io/seasons/eu-2017/events";

function create_hackathon_event(name, start_date, end_date, city, country) {
    return {
        name: name,
        start_date: start_date,
        end_date: end_date,
        city: city,
        country: country
    };
}

nightmare
    .goto(url)
    .evaluate(function() {
        function has_itemprop(event_node, itemprop) {
            if (event_node.hasAttribute("itemprop") && event_node.getAttribute("itemprop") == itemprop)
                return event_node;
            return null;
        }

        function get_element_by_itemprop(event_node, itemprop) {
            var itemprop_children = event_node.querySelectorAll("[itemprop]");
            for(var i = 0; i < itemprop_children.length; i++) {
                var itemprop_child = itemprop_children[i];
                if (has_itemprop(itemprop_child, itemprop)) {
                    console.log(itemprop_child);
                    return itemprop_child;
              }
            }
            return null;
        }

        function start_date_of_event_node(event_node) {
            var start_date_node = get_element_by_itemprop(event_node, "startDate");
            if (start_date_node != null) {
                return start_date_node.getAttribute("content");
            }
            return null;
        }

        function end_date_of_event_node(event_node) {
            var end_date_node = get_element_by_itemprop(event_node, "endDate");
            if (end_date_node != null) {
                return end_date_node.getAttribute("content");
                }
            return null;
        }

        function name_of_event_node(event_node) {
            var name_node = get_element_by_itemprop(event_node, "name");
            if (name_node != null) {
                return name_node.textContent;
            }
            return null;
        }

        function city_of_event_node(event_node) {
            var city_node = get_element_by_itemprop(event_node, "addressLocality");
            if (city_node != null) {
                return city_node.textContent;
            }
            return null;
        }

        function country_of_event_node(event_node) {
            var country_node = get_element_by_itemprop(event_node, "addressRegion");
            if (country_node != null) {
                return country_node.textContent;
            }
            return null;
        }
        var events = document.getElementsByClassName("event");
        var hackathon_events = [];
        for(var i = 0; i < events.length; i++) {
            var event_node = events[i];
            var name = name_of_event_node(event_node);
            var start_date = start_date_of_event_node(event_node);
            var end_date = end_date_of_event_node(event_node);
            var city = city_of_event_node(event_node);
            var country = country_of_event_node(event_node);
            hackathon_events.push({
                name: name,
                start_date: start_date,
                end_date: end_date,
                city: city,
                country: country
            });
        }
        return hackathon_events;
    })
    .end()
    .then(function(result) {
        for(var i = 0; i < result.length; i++)
            console.log(result[i]);
    })
    .catch(function(error) {
        console.log(error);
    });
