import Foundation
import PlaygroundSupport
let id = "peeper";
let password = "1234"
var json: [String: Any] = ["id": id,"password": password];

let jsonData = try? JSONSerialization.data(withJSONObject: json)

// create post request
let url = URL(string: "http://localhost:80/login")! //PUT Your URL
var request = URLRequest(url: url)
request.httpMethod = "POST"
request.setValue("\(String(describing: jsonData?.count))", forHTTPHeaderField: "Content-Length")
request.setValue("application/json", forHTTPHeaderField: "Content-Type")
// insert json data to the request
request.httpBody = jsonData

let task = URLSession.shared.dataTask(with: request) { data, response, error in
    guard let data = data, error == nil else {
        print(error?.localizedDescription ?? "No data")
        return
    }
    let responseJSON = try? JSONSerialization.jsonObject(with: data, options: [])
    if let responseJSON = responseJSON as? [String: Any] {
        print(responseJSON) //Code after Successfull POST Request
    }
}

task.resume()
